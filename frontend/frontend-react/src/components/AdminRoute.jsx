import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { obtenerUsuario } from '../utils/session';

// Ruta protegida: sin sesión manda al login, sin rol admin manda al inicio
function AdminRoute() {
  const location = useLocation();
  const usuario = obtenerUsuario();

  if (!usuario) {
    return <Navigate to='/login' replace state={{ desde: location.pathname }} />;
  }

  if (usuario.role !== 'admin') {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
