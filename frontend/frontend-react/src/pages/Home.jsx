import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../styles/home.css';

const categorias = [
  { nombre: 'Bazar', icono: '🍽️' },
  { nombre: 'Decoración', icono: '🏺' },
  { nombre: 'Blancos', icono: '🛏️' },
  { nombre: 'Electrodomésticos', icono: '🔌' },
];

function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarProductos() {
      try {
        const datos = await apiFetch('/products');

        if (activo) {
          setProductos(datos.products || []);
        }
      } catch {
        if (activo) {
          setError('No se pudieron cargar los productos destacados.');
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarProductos();

    return () => {
      activo = false;
    };
  }, []);

  const destacados = productos.slice(0, 4);

  return (
    <>
      {/* Banner principal */}
      <section className="banner">
        <div className="banner__content">
          <h1 className="banner__title">
            Bienvenidos a <span>Balbi Home</span>
          </h1>

          <p className="banner__subtitle">
            Todo lo que necesitás para tu hogar
          </p>

          <Link to="/catalogo" className="btn btn--primary">
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* Categorías */}
      <section className="categorias">
        <div className="section__container">
          <h2 className="section__title">
            Nuestras categorías
          </h2>

          <div className="categorias__grid">
            {categorias.map((categoria) => (
              <article
                className="categoria__card"
                key={categoria.nombre}
              >
                <div className="categoria__icon" aria-hidden="true">
                  {categoria.icono}
                </div>

                <h3>{categoria.nombre}</h3>

                <p>Descubrí nuestros productos</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="destacados">
        <div className="section__container">
          <h2 className="section__title">
            Productos destacados
          </h2>

          {cargando && <p>Cargando productos...</p>}

          {error && <p role="alert">{error}</p>}

          {!cargando && !error && destacados.length === 0 && (
            <p>Por el momento no hay productos disponibles.</p>
          )}

          {!cargando && !error && destacados.length > 0 && (
            <div className="productos__grid">
              {destacados.map((producto) => (
                <ProductCard
                  key={producto._id}
                  producto={producto}
                />
              ))}
            </div>
          )}

          <div className="destacados__cta">
            <Link to="/catalogo" className="btn btn--outline">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;