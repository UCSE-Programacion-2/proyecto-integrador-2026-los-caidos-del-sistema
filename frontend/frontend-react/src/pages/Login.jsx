import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/authContext';
import '../styles/login.css';

// Formulario controlado de inicio de sesión (POST /api/auth/login)
function Login() {
  const { login, estaLogueado } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(() => {
    if (location.state?.registrado) return '¡Registro exitoso! Ya podés iniciar sesión.';
    if (location.state?.desde) return 'Iniciá sesión para continuar.';
    return '';
  });
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async evento => {
    evento.preventDefault();

    if (!email.trim() || !password) {
      setMensaje('Completá el email y la contraseña.');
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      await login(email.trim(), password);
      // Vuelve a la página protegida que se quiso abrir, o al inicio
      navigate(location.state?.desde || '/', { replace: true });
    } catch (error) {
      setMensaje(error.message);
      setCargando(false);
    }
  };

  // Con la sesión iniciada no tiene sentido ver el login: vuelve a donde corresponda
  if (estaLogueado) {
    return <Navigate to={location.state?.desde || '/'} replace />;
  }

  return (
    <section className='login__main'>
      <div className='login__card'>
        <h1>Iniciar sesión</h1>

        <form className='login__form' onSubmit={manejarEnvio}>
          <div className='login__campo'>
            <label htmlFor='email'>Correo electrónico</label>
            <input
              type='email'
              id='email'
              placeholder='ejemplo@email.com'
              value={email}
              onChange={evento => setEmail(evento.target.value)}
            />
          </div>

          <div className='login__campo'>
            <label htmlFor='password'>Contraseña</label>
            <input
              type='password'
              id='password'
              placeholder='Ingresá tu contraseña'
              value={password}
              onChange={evento => setPassword(evento.target.value)}
            />
          </div>

          <p className='login__mensaje' aria-live='polite'>
            {mensaje}
          </p>

          <button type='submit' className='btn btn--primary login__btn' disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>

          <Link to='/registro' className='login__link'>
            ¿No tenés cuenta? Registrate
          </Link>
          <Link to='/' className='login__link'>
            Volver al inicio
          </Link>
        </form>
      </div>
    </section>
  );
}

export default Login;
