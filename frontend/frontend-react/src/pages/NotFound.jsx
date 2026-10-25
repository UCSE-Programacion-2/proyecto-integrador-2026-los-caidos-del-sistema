import { Link } from 'react-router-dom';

import '../styles/not-found.css';

// Página 404: se muestra en cualquier ruta que no exista
function NotFound() {
  return (
    <section className='error404'>
      <div className='error404__container'>
        <p className='error404__codigo'>404</p>
        <h1 className='error404__titulo'>Página no encontrada</h1>
        <p className='error404__mensaje'>
          Lo sentimos, la página que estás buscando no existe o fue movida.
        </p>

        <div className='error404__acciones'>
          <Link to='/' className='btn btn--primary'>
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
