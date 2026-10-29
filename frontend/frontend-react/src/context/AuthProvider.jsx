import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AuthContext } from './authContext';
import { apiFetch } from '../services/api';
import {
  borrarSesion,
  EVENTO_SESION_VENCIDA,
  guardarSesion,
  obtenerUsuario,
} from '../utils/session';

// Provee la sesión a toda la app. Arranca con la sesión guardada en localStorage
function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerUsuario);

  // Si la API avisa que el token venció, la app pasa a "sin sesión"
  useEffect(() => {
    const alVencer = () => setUsuario(null);
    window.addEventListener(EVENTO_SESION_VENCIDA, alVencer);
    return () => window.removeEventListener(EVENTO_SESION_VENCIDA, alVencer);
  }, []);

  // POST /api/auth/login → guarda token y usuario
  const login = useCallback(async (email, password) => {
    const datos = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    guardarSesion(datos.token, datos.user);
    setUsuario(datos.user);

    return datos.user;
  }, []);

  // POST /api/auth/register → crea el usuario (después inicia sesión en el login)
  const registrar = useCallback(async (name, email, password) => {
    const datos = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    return datos.user;
  }, []);

  const logout = useCallback(() => {
    borrarSesion();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      estaLogueado: Boolean(usuario),
      esAdmin: usuario?.role === 'admin',
      login,
      registrar,
      logout,
    }),
    [usuario, login, registrar, logout],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
