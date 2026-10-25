import { useParams } from 'react-router-dom';

// Página provisoria. El detalle con fetch a /api/products/:id se implementa en feat/react-home.
function Detalle() {
  const { id } = useParams();

  return (
    <section className='pagina'>
      <h1>Detalle de producto</h1>
      <p>Producto: {id}</p>
    </section>
  );
}

export default Detalle;
