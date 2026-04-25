import { apiFetch } from './api';

export const recursoService = {
  obtenerTodos: () => apiFetch('/recursos'),
};
