/* ========================================
   LOGIN CONECTADO A LA API — BALBI HOME
   feat/js-auth-login
   ======================================== */

// URL del endpoint de login del backend
const LOGIN_URL = 'http://localhost:4000/api/auth/login';

// Muestra un mensaje debajo del formulario
function mostrarMensaje(texto) {
  const mensaje = document.querySelector('#login-mensaje');
  mensaje.textContent = texto;
}

// Guarda la sesion con las mismas claves que lee navbar.js
function guardarSesion(token, usuario) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(usuario));
}

// Envia las credenciales al backend y maneja la respuesta
async function iniciarSesion(event) {
  event.preventDefault();

  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;

  if (!email || !password) {
    mostrarMensaje('Completá el email y la contraseña.');
    return;
  }

  mostrarMensaje('');

  try {
    const respuesta = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(datos.error ? datos.error.message : 'No se pudo iniciar sesión.');
      return;
    }

    guardarSesion(datos.token, datos.user);
    window.location.href = 'index.html';
  } catch (error) {
    mostrarMensaje('No se pudo conectar con el servidor. Intentá más tarde.');
  }
}

function inicializarLogin() {
  const formulario = document.querySelector('.login__form');
  formulario.addEventListener('submit', iniciarSesion);
}

document.addEventListener('DOMContentLoaded', inicializarLogin);
