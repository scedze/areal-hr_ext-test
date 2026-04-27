import api from './client';

export const employeesApi = {
  getAll: (url) => api.get(url || '/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  restore: (id) => api.post(`/employees/${id}/restore`),
};