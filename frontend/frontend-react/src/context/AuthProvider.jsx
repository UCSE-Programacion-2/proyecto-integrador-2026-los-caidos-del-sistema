import { useCallback, useMemo, useState } from 'react';

import { AuthContext } from './authContext';
import { apiFetch } from '../services/api';
import { borrarSesion, guardarSesion, obtenerUsuario } from '../utils/session';

// Provee la sesión a toda la app. Arranca con la sesión guardada en localStorage
function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerUsuario);

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

export default AuthProvider;
