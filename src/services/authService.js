import { apiFetch } from './api';

export const authService = {
  login: (email, password) => 
    apiFetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  registro: (data) => {
    // Mapeamos 'tipoUsuario' a 'rol' para coincidir con la convención del backend
    const payload = { ...data, rol: data.tipoUsuario };
    return apiFetch('/registro', { method: 'POST', body: JSON.stringify(payload) });
  },

  logout: () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
