import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Estructura común de todas las páginas.

function Layout() {
  return (
    <>
      <Navbar />

      <main className='layout__contenido'>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default Layout;
