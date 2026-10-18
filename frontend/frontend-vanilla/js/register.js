// URL del endpoint de registro
const API_REGISTER_URL = 'http://localhost:4000/api/auth/register';

// Obtener los elementos del formulario
const registroForm = document.getElementById('registro-form');
const registroMensaje = document.getElementById('registro-mensaje');

// Escuchar cuando el usuario envía el formulario
registroForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Obtener los datos ingresados
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Validar que los campos estén completos
  if (!name || !email || !password.trim()) {
    registroMensaje.textContent = 'Todos los campos son obligatorios.';
    return;
  }

  // Obtener el botón para evitar envíos duplicados
  const botonRegistro = registroForm.querySelector('button[type="submit"]');

  try {
    botonRegistro.disabled = true;
    registroMensaje.textContent = 'Registrando usuario...';

    // Enviar los datos al backend
    const respuesta = await fetch(API_REGISTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    // Leer la respuesta del servidor
    const data = await respuesta.json();

    // Verificar si ocurrió un error
    if (!respuesta.ok) {
      throw new Error(data.error?.message || 'No se pudo registrar el usuario.');
    }

    // Mostrar mensaje de éxito
    registroMensaje.textContent = '¡Registro exitoso! Redirigiendo al inicio de sesión...';

    // Limpiar el formulario
    registroForm.reset();

    // Redirigir al Login después de 2 segundos
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    registroMensaje.textContent = error.message;
    botonRegistro.disabled = false;
  }
});