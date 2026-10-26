import { Link } from 'react-router-dom';
import { useCart } from '../context/cartContext';

import '../styles/carrito.css';

// Formatear los precios en pesos argentinos
function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor);
}

function Carrito() {
  const {
    carrito,
    cambiarCantidad,
    eliminarDelCarrito,
    subtotal,
    envio,
    total,
    errorCarrito,
  } = useCart();

  return (
    <main className='pagina carrito'>
      <section className='carrito__header'>
        <h1>Mi carrito</h1>
        <p>Revisá los productos que seleccionaste antes de finalizar tu compra.</p>
      </section>

      {errorCarrito && (
        <p className='carrito__error' role='alert'>
          {errorCarrito}
        </p>
      )}

      {carrito.length === 0 ? (
        <section className='carrito__vacio'>
          <h2>Tu carrito está vacío</h2>
          <p>¡Explorá nuestro catálogo y encontrá productos para tu hogar!</p>

          <Link to='/catalogo' className='btn btn--primary'>
            Ver catálogo
          </Link>
        </section>
      ) : (
        <div className='carrito__container'>
          <section className='carrito__productos'>
            <h2>Productos seleccionados</h2>

            <div className='carrito__tabla-contenedor'>
              <table className='carrito__tabla'>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {carrito.map((producto) => (
                    <tr key={producto.id}>
                      <td>
                        <div className='carrito__producto'>
                          <span className='carrito__producto-img' aria-hidden='true'>
                            📦
                          </span>

                          <div>
                            <h3>{producto.name}</h3>
                            <p>{producto.category || 'Sin categoría'}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className='carrito__cantidad'>
                          <button
                            type='button'
                            className='carrito__cantidad-btn'
                            onClick={() => cambiarCantidad(producto.id, -1)}
                            disabled={producto.quantity <= 1}
                            aria-label={`Disminuir cantidad de ${producto.name}`}
                          >
                            −
                          </button>

                          <span>{producto.quantity}</span>

                          <button
                            type='button'
                            className='carrito__cantidad-btn'
                            onClick={() => cambiarCantidad(producto.id, 1)}
                            aria-label={`Aumentar cantidad de ${producto.name}`}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td>{formatearPrecio(producto.price)}</td>

                      <td>
                        <div className='carrito__subtotal-producto'>
                          <span>
                            {formatearPrecio(producto.price * producto.quantity)}
                          </span>

                          <button
                            type='button'
                            className='carrito__eliminar-btn'
                            onClick={() => eliminarDelCarrito(producto.id)}
                            aria-label={`Eliminar ${producto.name} del carrito`}
                            title='Eliminar producto'
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className='carrito__resumen'>
            <h2>Resumen de compra</h2>

            <div className='carrito__resumen-linea'>
              <span>Subtotal</span>
              <strong>{formatearPrecio(subtotal)}</strong>
            </div>

            <div className='carrito__resumen-linea'>
              <span>Envío</span>
              <strong>{envio === 0 ? 'Gratis' : formatearPrecio(envio)}</strong>
            </div>

            <div className='carrito__resumen-total'>
              <span>Total</span>
              <strong>{formatearPrecio(total)}</strong>
            </div>

            <Link to='/checkout' className='btn btn--primary'>
              Finalizar compra
            </Link>

            <Link to='/catalogo' className='btn btn--outline'>
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Carrito;