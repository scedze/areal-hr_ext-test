import api from './client';

export const departmentsApi = {
  getAll: () => api.get('/departments'),
  getTree: () => api.get('/departments?tree=true'),
  getByOrganization: (orgId) => api.get(`/departments?organizationId=${orgId}`),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  restore: (id) => api.post(`/departments/${id}/restore`),
};