import { Link } from 'react-router-dom';

function ProductCard({ producto }) {
  const precioFormateado = Number(producto.price).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <article className="product-card">
      <Link to={`/producto/${producto._id}`} className="product-card__link">
        <div className="product-card__imagen">
          {producto.image ? (
            <img
              src={producto.image}
              alt={producto.name}
              loading="lazy"
            />
          ) : (
            <div className="product-card__placeholder">
              Sin imagen
            </div>
          )}
        </div>

        <div className="product-card__contenido">
          <p className="product-card__categoria">
            {producto.category}
          </p>

          <h3 className="product-card__nombre">
            {producto.name}
          </h3>

          <p className="product-card__precio">
            ${precioFormateado}
          </p>

          <span className="product-card__ver">
            Ver detalle
          </span>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;