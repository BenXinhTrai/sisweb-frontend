import { apiFetch } from './api';

export const seminarioService = {
  obtenerTodos: () => apiFetch('/seminarios'),
  crear: (datos) => apiFetch('/seminarios', { method: 'POST', body: JSON.stringify(datos) }),
  inscribirParticipante: (datos) => apiFetch('/inscripciones', { method: 'POST', body: JSON.stringify(datos) }),
  misInscripciones: (idParticipante) => apiFetch(`/mis-inscripciones/${idParticipante}`),
  estudiantesInscritos: (idSeminario) => apiFetch(`/seminario-inscritos/${idSeminario}`),
};
