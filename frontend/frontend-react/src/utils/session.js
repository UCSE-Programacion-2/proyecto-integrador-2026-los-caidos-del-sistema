// Claves de localStorage donde el login guarda la sesión (mismas que el Sprint 3)
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Devuelve el usuario logueado ({ id, name, email, role }) o null si no hay sesión
export function obtenerUsuario() {
  const token = localStorage.getItem(TOKEN_KEY);
  const usuarioGuardado = localStorage.getItem(USER_KEY);

  if (!token || !usuarioGuardado) {
    return null;
  }

  try {
    return JSON.parse(usuarioGuardado);
  } catch (error) {
    return null;
  }
}
