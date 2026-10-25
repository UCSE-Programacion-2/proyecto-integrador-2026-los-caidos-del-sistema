import { createContext, useContext } from 'react';

// Contexto global de autenticación (usuario logueado + acciones)
export const AuthContext = createContext(null);

// Hook para usar la sesión desde cualquier componente: const { usuario } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
