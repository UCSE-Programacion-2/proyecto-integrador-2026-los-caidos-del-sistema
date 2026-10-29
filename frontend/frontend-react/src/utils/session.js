// Claves de localStorage donde se guarda la sesión (mismas que el Sprint 3)
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Evento que se dispara cuando el backend rechaza el token (vencido o inválido)
export const EVENTO_SESION_VENCIDA = 'sesion-vencida';

// El token JWT trae su fecha de vencimiento ("exp", en segundos) en la parte del medio
function tokenVencido(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(base64));
    return typeof exp === 'number' && exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}

// Borra la sesión al cerrar sesión
export function borrarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Devuelve el usuario logueado ({ id, name, email, role }) o null si no hay sesión
export function obtenerUsuario() {
  const token = localStorage.getItem(TOKEN_KEY);
  const usuarioGuardado = localStorage.getItem(USER_KEY);

  if (!token || !usuarioGuardado) {
    return null;
  }

  // Si el token ya venció, la sesión no sirve: se borra
  if (tokenVencido(token)) {
    borrarSesion();
    return null;
  }

  try {
    return JSON.parse(usuarioGuardado);
  } catch (error) {
    return null;
  }
}

// Guarda el token y el usuario que devuelve el login
export function guardarSesion(token, usuario) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}
