import { apiFetch } from './api';

export const authService = {
  login: (email, password) => 
    apiFetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  registro: (email, password, rol) => 
    apiFetch('/registro', { method: 'POST', body: JSON.stringify({ email, password, rol }) }),

  logout: () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
