import { apiFetch } from './api';

export const authService = {
  login: (email, password) => 
    apiFetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  registro: (data) => {
    // Mapeamos 'tipoUsuario' a 'rol' para coincidir con la convención del backend
    const payload = { ...data, rol: data.tipoUsuario };
    return apiFetch('/registro', { method: 'POST', body: JSON.stringify(payload) });
  },

  solicitarRecuperacion: (email) =>
    apiFetch('/olvide-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token, newPassword) =>
    apiFetch('/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),

  logout: () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
