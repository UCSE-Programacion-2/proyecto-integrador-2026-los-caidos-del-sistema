import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// indice: posición en la grilla, para escalonar la animación de entrada
function ProductCard({ producto, indice = 0 }) {
  const precioFormateado = Number(producto.price).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const sinStock = Number(producto.stock) <= 0;

  return (
    <article className='product-card' style={{ '--i': Math.min(indice, 11) }}>
      <Link to={`/producto/${producto._id}`} className='product-card__link'>
        <div className='product-card__imagen'>
          {sinStock && <span className='product-card__badge'>Sin stock</span>}

          {producto.image ? (
            <img src={producto.image} alt={producto.name} loading='lazy' />
          ) : (
            <div className='product-card__placeholder'>Sin imagen</div>
          )}
        </div>

        <div className='product-card__contenido'>
          <p className='product-card__categoria'>{producto.category}</p>

          <h3 className='product-card__nombre'>{producto.name}</h3>

          <p className='product-card__precio'>${precioFormateado}</p>

          <span className='product-card__ver'>Ver detalle</span>
        </div>
      </Link>
    </article>
  );
}

ProductCard.propTypes = {
  producto: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string,
    image: PropTypes.string,
    stock: PropTypes.number,
  }).isRequired,
  indice: PropTypes.number,
};

export default ProductCard;
