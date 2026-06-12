import { api } from './axios.js';

export const categoriesApi = {
  list: () => api.get('/categories').then((r) => r.data),
  get: (slug) => api.get(`/categories/${slug}`).then((r) => r.data),
  create: (payload) => api.post('/categories', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/categories/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};

export default categoriesApi;
