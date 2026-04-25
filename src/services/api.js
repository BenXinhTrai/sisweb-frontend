const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Cliente central para peticiones HTTP
 * Captura y lanza errores de red o HTTP (como 400 o 500) para delegarlos al manejo del componente.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    // Intentamos parsear el JSON de la respuesta
    const data = await response.json().catch(() => null);

    // Si la respuesta no es OK (ej: 400, 401, 500), lanzamos el error atrapado por el servidor
    if (!response.ok) {
      // El backend de SISWEB suele regresar { error: "..." } o { mensaje: "..." }
      const errorMsg = data?.error || data?.mensaje || `Error HTTP: ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    // Si fetch falla por caída del servidor (net::ERR_CONNECTION_REFUSED) o lanzamos nosotros el throw arriba
    throw error;
  }
};
