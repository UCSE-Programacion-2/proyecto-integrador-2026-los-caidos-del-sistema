import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/authContext';
import '../styles/login.css';

// Formulario controlado de registro (POST /api/auth/register)
function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({ name: '', email: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // Un solo manejador para los tres inputs (usa el atributo name)
  const manejarCambio = evento => {
    const { name, value } = evento.target;
    setFormulario(anterior => ({ ...anterior, [name]: value }));
  };

  const manejarEnvio = async evento => {
    evento.preventDefault();

    const name = formulario.name.trim();
    const email = formulario.email.trim();

    if (!name || !email || !formulario.password.trim()) {
      setMensaje('Todos los campos son obligatorios.');
      return;
    }

    // Mismas reglas que el backend, para avisar antes de enviar
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMensaje('Ingresá un correo electrónico válido.');
      return;
    }

    if (formulario.password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    setMensaje('Registrando usuario...');

    try {
      await registrar(name, email, formulario.password);
      navigate('/login', { state: { registrado: true } });
    } catch (error) {
      setMensaje(error.message);
      setCargando(false);
    }
  };

  return (
    <section className='login__main'>
      <div className='login__card'>
        <h1>Crear cuenta</h1>

        <form className='login__form' onSubmit={manejarEnvio}>
          <div className='login__campo'>
            <label htmlFor='name'>Nombre completo</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Ingresá tu nombre'
              value={formulario.name}
              onChange={manejarCambio}
            />
          </div>

          <div className='login__campo'>
            <label htmlFor='email'>Correo electrónico</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='ejemplo@email.com'
              value={formulario.email}
              onChange={manejarCambio}
            />
          </div>

          <div className='login__campo'>
            <label htmlFor='password'>Contraseña</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Mínimo 6 caracteres'
              value={formulario.password}
              onChange={manejarCambio}
              aria-describedby='password-ayuda'
            />
            <small id='password-ayuda' className='login__ayuda'>
              Usá al menos 6 caracteres.
            </small>
          </div>

          <p className='login__mensaje' aria-live='polite'>
            {mensaje}
          </p>

          <button type='submit' className='btn btn--primary login__btn' disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>

          <Link to='/login' className='login__link'>
            ¿Ya tenés cuenta? Iniciá sesión
          </Link>
        </form>
      </div>
    </section>
  );
}

export default Registro;
