import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * In-memory access token store. Refresh token lives in an httpOnly cookie,
 * so it is never exposed to JS — only the short-lived access token is held
 * in memory and attached to requests.
 */
let accessToken = null;
const subscribers = new Set();

export function setAccessToken(token) {
  accessToken = token;
  subscribers.forEach((cb) => cb(token));
}
export function getAccessToken() {
  return accessToken;
}
export function onAccessTokenChange(cb) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send refresh cookie on /auth/refresh
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ── Silent refresh on 401 ──────────────────────────────────────────────
let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || '';

    // Don't try to refresh on the auth endpoints themselves.
    const isAuthCall =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/register');

    if (status === 401 && !original._retry && !isAuthCall) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        const newToken = data?.data?.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/** Normalise API errors into a friendly message + field errors. */
export function parseApiError(error) {
  const res = error?.response?.data;
  return {
    message: res?.message || error?.message || 'Something went wrong',
    errors: res?.errors || null,
    status: error?.response?.status,
  };
}

export default api;
