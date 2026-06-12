import { api } from './axios.js';

export const productsApi = {
  list: (params) =>
    api.get('/products', { params }).then((r) => r.data),
  get: (idOrSlug) => api.get(`/products/${idOrSlug}`).then((r) => r.data),
  featured: () => api.get('/products/featured').then((r) => r.data),
  search: (q) => api.get('/products/search', { params: { q } }).then((r) => r.data),
  create: (payload) => api.post('/products', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/products/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
};

export default productsApi;
