import { Outlet } from 'react-router-dom';

// Estructura común de todas las páginas.
// Navbar y Footer se agregan en feat/react-layout
function Layout() {
  return (
    <main className='layout__contenido'>
      <Outlet />
    </main>
  );
}

export default Layout;
