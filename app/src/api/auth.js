import api from './client';

export const authApi = {
  login: (login, password) => api.post('/auth/login', { login, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.post('/auth/me'),
};