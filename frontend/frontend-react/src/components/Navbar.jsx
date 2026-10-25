import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Navbar() {
  const { usuario, estaLogueado, esAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          BALBI <span>HOME</span>
        </Link>

        <nav className="navbar__nav" aria-label="Navegación principal">
          <ul className="navbar__links">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Inicio
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/catalogo"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Catálogo
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/carrito"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Carrito
              </NavLink>
            </li>

            {esAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Admin
                </NavLink>
              </li>
            )}

            {!estaLogueado ? (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Ingresar
                </NavLink>
              </li>
            ) : (
              <>
                <li className="navbar__usuario">
                  Hola, {usuario.name}
                </li>

                <li>
                  <button
                    type="button"
                    className="navbar__logout"
                    onClick={cerrarSesion}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;