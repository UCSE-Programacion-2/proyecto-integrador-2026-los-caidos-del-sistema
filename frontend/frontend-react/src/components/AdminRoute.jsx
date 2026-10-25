import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/authContext';

// Ruta protegida: sin sesión manda al login, sin rol admin manda al inicio
function AdminRoute() {
  const location = useLocation();
  const { estaLogueado, esAdmin } = useAuth();

  if (!estaLogueado) {
    return <Navigate to='/login' replace state={{ desde: location.pathname }} />;
  }

  if (!esAdmin) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
