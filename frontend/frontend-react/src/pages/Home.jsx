import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import ProductCard from '../components/ProductCard';
import Revelar from '../components/Revelar';
import '../styles/home.css';

// valor: nombre exacto de la categoría en la base (enum del modelo Product)
// foto: imagen representativa de la categoría (fotos reales del local)
const categorias = [
  { nombre: 'Bazar', valor: 'Bazar', foto: '/productos/platos.jpg' },
  { nombre: 'Decoración', valor: 'Decoración', foto: '/productos/espejo.jpg' },
  { nombre: 'Blancos', valor: 'Blanco', foto: '/productos/cubrecama.jpg' },
  {
    nombre: 'Electrodomésticos',
    valor: 'Electrodomésticos',
    foto: '/productos/licuadora.jpg',
  },
];

// Fotos del mosaico de la portada
const mosaico = [
  { foto: '/productos/mesa.jpg', texto: 'Set de mesa' },
  { foto: '/productos/vela.jpg', texto: 'Vela aromática' },
  { foto: '/productos/almohadones.jpg', texto: 'Almohadones' },
  { foto: '/productos/tetera-hierro.jpg', texto: 'Tetera de hierro' },
];

const beneficios = [
  { icono: '🚚', titulo: 'Envío gratis', texto: 'En todas tus compras online.' },
  {
    icono: '📍',
    titulo: 'Belgrano 970',
    texto: 'Te esperamos en San Salvador de Jujuy.',
  },
  { icono: '🕘', titulo: 'Lunes a sábado', texto: 'Abierto de 9 a 21 hs.' },
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

  // Un producto destacado por categoría (el primero de cada una)
  const destacados = categorias
    .map(categoria => productos.find(producto => producto.category === categoria.valor))
    .filter(Boolean);

  const contarProductos = valor => productos.filter(producto => producto.category === valor).length;

  return (
    <>
      {/* Portada: texto a la izquierda y mosaico de fotos a la derecha */}
      <section className='portada'>
        <div className='portada__contenido'>
          <div className='portada__texto'>
            <p className='portada__etiqueta'>Artículos para el hogar · San Salvador de Jujuy</p>

            <h1 className='portada__titulo'>
              Todo para tu hogar, <span>en un solo lugar</span>
            </h1>

            <p className='portada__frase'>
              Bazar, decoración, blancos y electrodomésticos para darle a cada ambiente tu estilo.
            </p>

            <div className='portada__acciones'>
              <Link to='/catalogo' className='btn btn--primary'>
                Ver catálogo
              </Link>

              <a href='#visitanos' className='btn btn--outline'>
                Visitá el local
              </a>
            </div>

            <ul className='portada__datos'>
              <li>
                <strong>{cargando ? '—' : productos.length}</strong>
                <span>productos</span>
              </li>
              <li>
                <strong>{categorias.length}</strong>
                <span>categorías</span>
              </li>
              <li>
                <strong>$0</strong>
                <span>de envío</span>
              </li>
            </ul>
          </div>

          <div className='portada__mosaico' aria-hidden='true'>
            {mosaico.map((item, indice) => (
              <figure className='portada__foto' key={item.foto} style={{ '--i': indice }}>
                <img src={item.foto} alt='' />
                <figcaption>{item.texto}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías: tarjetas con foto que abren el catálogo ya filtrado */}
      <Revelar como='section' className='seccion'>
        <div className='seccion__contenedor'>
          <div className='seccion__cabecera'>
            <h2 className='seccion__titulo'>Comprá por categoría</h2>
            <p className='seccion__subtitulo'>
              Encontrá lo que buscás para cada rincón de tu casa.
            </p>
          </div>

          <div className='categorias__grid'>
            {categorias.map((categoria, indice) => (
              <Link
                to={`/catalogo?categoria=${encodeURIComponent(categoria.valor)}`}
                className='categoria'
                key={categoria.nombre}
                style={{ '--i': indice }}
              >
                <img className='categoria__foto' src={categoria.foto} alt='' loading='lazy' />

                <div className='categoria__info'>
                  <h3>{categoria.nombre}</h3>
                  <span>
                    {cargando ? 'Ver productos' : `${contarProductos(categoria.valor)} productos`} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Revelar>

      {/* Productos destacados */}
      <Revelar como='section' className='seccion seccion--blanca'>
        <div className='seccion__contenedor'>
          <div className='seccion__cabecera seccion__cabecera--fila'>
            <div>
              <h2 className='seccion__titulo'>Productos destacados</h2>
              <p className='seccion__subtitulo'>Una selección de cada categoría.</p>
            </div>

            <Link to='/catalogo' className='seccion__link'>
              Ver todo el catálogo →
            </Link>
          </div>

          {/* Mientras carga: tarjetas "esqueleto" (el servidor gratuito puede tardar en despertar) */}
          {cargando && (
            <div aria-busy='true'>
              <p className='aviso-servidor'>
                Estamos despertando el servidor. La primera carga puede tardar unos segundos.
              </p>

              <div className='productos__grid'>
                {[0, 1, 2, 3].map(n => (
                  <div className='esqueleto esqueleto--tarjeta' key={n} />
                ))}
              </div>
            </div>
          )}

          {error && <p role='alert'>{error}</p>}

          {!cargando && !error && destacados.length === 0 && (
            <p>Por el momento no hay productos disponibles.</p>
          )}

          {!cargando && !error && destacados.length > 0 && (
            <div className='productos__grid'>
              {destacados.map((producto, indice) => (
                <ProductCard key={producto._id} producto={producto} indice={indice} />
              ))}
            </div>
          )}
        </div>
      </Revelar>

      {/* Beneficios */}
      <Revelar como='section' className='seccion'>
        <ul className='beneficios seccion__contenedor'>
          {beneficios.map(beneficio => (
            <li className='beneficio' key={beneficio.titulo}>
              <span className='beneficio__icono' aria-hidden='true'>
                {beneficio.icono}
              </span>

              <div>
                <h3>{beneficio.titulo}</h3>
                <p>{beneficio.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </Revelar>

      {/* Cierre: invitación al local */}
      <Revelar como='section' className='seccion' id='visitanos'>
        <div className='seccion__contenedor'>
          <div className='visitanos'>
            <div className='visitanos__texto'>
              <h2>Visitanos en el local</h2>

              <p>Belgrano 970, San Salvador de Jujuy. Lunes a sábado de 9 a 21 hs.</p>

              <div className='visitanos__acciones'>
                <Link to='/catalogo' className='btn btn--claro'>
                  Comprá online
                </Link>

                <a
                  href='https://www.instagram.com/balbihome_jujuy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn--borde-claro'
                >
                  Seguinos en Instagram
                </a>
              </div>
            </div>

            <img
              className='visitanos__foto'
              src='/local-fachada.jpg'
              alt='Fachada del local de Balbi Home en calle Belgrano'
              loading='lazy'
            />
          </div>
        </div>
      </Revelar>
    </>
  );
}

export default Home;
