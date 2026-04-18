import api from './client';
export const organizationsApi = {
    getAll: () => api.get('/organizations'),
    getById: (id) => api.get(`/organizations/${id}`),
    create: (data) => api.post('/organizations', data),
    update: (id, data) => api.put(`/organizations/${id}`, data),
    delete: (id) => api.delete(`/organizations/${id}`),
};