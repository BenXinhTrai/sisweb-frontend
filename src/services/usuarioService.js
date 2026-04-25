import { apiFetch } from './api';

export const usuarioService = {
  obtenerTodos: () => apiFetch('/usuarios'),
  obtenerCoordinadores: () => apiFetch('/coordinadores'),
  obtenerPonentes: () => apiFetch('/ponentes'),
};
