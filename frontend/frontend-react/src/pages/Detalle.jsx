import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useCart } from '../context/cartContext';
import '../styles/detalle.css';

function Detalle() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarProducto() {
      try {
        const datos = await apiFetch(`/products/${id}`);

        if (activo) {
          setProducto(datos.product || null);
        }
      } catch {
        if (activo) {
          setError('No se pudo cargar el detalle del producto.');
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarProducto();

    return () => {
      activo = false;
    };
  }, [id]);

  function handleAgregarAlCarrito() {
    if (!producto || Number(producto.stock) <= 0) {
      return;
    }

    agregarAlCarrito(producto);
    setMensaje('¡Producto agregado al carrito!');
  }

  if (cargando) {
    return (
      <section className="pagina">
        <p>Cargando producto...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pagina">
        <p role="alert">{error}</p>
        <Link to="/catalogo">Volver al catálogo</Link>
      </section>
    );
  }

  if (!producto) {
    return (
      <section className="pagina">
        <h1>Producto no encontrado</h1>
        <Link to="/catalogo">Volver al catálogo</Link>
      </section>
    );
  }

  const precioFormateado = Number(producto.price).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const disponible = Number(producto.stock) > 0;

  return (
    <section className="pagina detalle">
      <Link to="/catalogo" className="detalle__volver">
        ← Volver al catálogo
      </Link>

      <div className="detalle__contenido">
        {/* Imagen del producto */}
        <div className="detalle__imagen">
          {producto.image ? (
            <img src={producto.image} alt={producto.name} />
          ) : (
            <p>Imagen no disponible</p>
          )}
        </div>

        {/* Información del producto */}
        <div className="detalle__informacion">
          <p className="detalle__categoria">
            {producto.category}
          </p>

          <h1>{producto.name}</h1>

          <p className="detalle__precio">
            ${precioFormateado}
          </p>

          <p className="detalle__descripcion">
            {producto.description || 'Sin descripción disponible.'}
          </p>

          <p className="detalle__stock">
            {disponible
              ? `Disponible (${producto.stock} unidades)`
              : 'Producto sin stock'}
          </p>

          <button
            type="button"
            className="btn btn--primary"
            onClick={handleAgregarAlCarrito}
            disabled={!disponible}
          >
            {disponible ? 'Agregar al carrito' : 'Sin stock'}
          </button>

          {mensaje && (
            <p className="detalle__mensaje" role="status">
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Detalle;