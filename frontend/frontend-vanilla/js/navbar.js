/* ========================================
   NAVBAR SEGUN ESTADO DE SESION — BALBI HOME
   feat/js-navbar-state
   ======================================== */

// Claves de localStorage donde el login guarda la sesion
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Devuelve el usuario logueado o null si no hay sesion
function obtenerUsuario() {
  const token = localStorage.getItem(TOKEN_KEY);
  const usuario = localStorage.getItem(USER_KEY);

  if (!token || !usuario) {
    return null;
  }

  try {
    return JSON.parse(usuario);
  } catch (error) {
    return null;
  }
}

// Borra la sesion y vuelve al inicio
function cerrarSesion(event) {
  event.preventDefault();
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = 'index.html';
}

// Crea un <li> con un link adentro
function crearItemLink(texto, href) {
  const item = document.createElement('li');
  const link = document.createElement('a');
  link.href = href;
  link.textContent = texto;
  item.appendChild(link);
  return item;
}

// Cambia las opciones del navbar si hay un usuario logueado
function renderizarNavbar() {
  const linkIngresar = document.querySelector('.navbar__links a[href="login.html"]');
  const usuario = obtenerUsuario();

  if (!linkIngresar || !usuario) {
    return;
  }

  const itemIngresar = linkIngresar.parentElement;
  const listaLinks = itemIngresar.parentElement;

  // Link al panel solo para administradores
  if (usuario.role === 'admin') {
    const itemAdmin = crearItemLink('Admin', 'admin.html');
    if (window.location.pathname.endsWith('admin.html')) {
      itemAdmin.firstChild.classList.add('active');
    }
    listaLinks.insertBefore(itemAdmin, itemIngresar);
  }

  // Saludo con el nombre del usuario
  const itemSaludo = document.createElement('li');
  const saludo = document.createElement('span');
  saludo.className = 'navbar__usuario';
  saludo.textContent = `Hola, ${usuario.name}`;
  itemSaludo.appendChild(saludo);
  listaLinks.insertBefore(itemSaludo, itemIngresar);

  // "Salir" reemplaza a "Ingresar"
  const itemSalir = crearItemLink('Salir', '#');
  itemSalir.firstChild.addEventListener('click', cerrarSesion);
  listaLinks.replaceChild(itemSalir, itemIngresar);
}

document.addEventListener('DOMContentLoaded', renderizarNavbar);
