// URL base de la API. En producción se define VITE_API_URL en Vercel
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Hace un fetch a la API y devuelve el JSON, o lanza un error con el mensaje del backend
export async function apiFetch(endpoint, opciones = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...opciones.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_URL}${endpoint}`, { ...opciones, headers });
  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(datos.error?.message || 'Error al comunicarse con el servidor');
  }

  return datos;
}
