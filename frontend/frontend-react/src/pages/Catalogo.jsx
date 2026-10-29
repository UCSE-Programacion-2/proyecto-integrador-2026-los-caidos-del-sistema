import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../styles/home.css';
import '../styles/catalogo.css';

// Para buscar sin importar mayúsculas ni tildes ("lampara" encuentra "Lámpara")
const normalizar = texto =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

function Catalogo() {
  // Si se llega desde una categoría del inicio (?categoria=Bazar), arranca filtrado
  const [searchParams] = useSearchParams();

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || '');
  const [precioMaximo, setPrecioMaximo] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [orden, setOrden] = useState('');
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
          setError('No se pudieron cargar los productos.');
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

  const categorias = [...new Set(productos.map(producto => producto.category))];

  // Si la categoría de la URL no existe (ej. ?categoria=xyz), se muestran todas
  const categoriaValida = categorias.includes(categoria) ? categoria : '';

  const productosFiltrados = productos
    // Busca en el nombre y en la categoría
    .filter(producto =>
      normalizar(`${producto.name} ${producto.category}`).includes(normalizar(busqueda.trim())),
    )
    .filter(producto => (categoriaValida ? producto.category === categoriaValida : true))
    .filter(producto =>
      precioMaximo !== '' ? Number(producto.price) <= Number(precioMaximo) : true,
    )
    .filter(producto => (soloDisponibles ? Number(producto.stock) > 0 : true))
    .sort((a, b) => {
      if (orden === 'precio-asc') {
        return Number(a.price) - Number(b.price);
      }

      if (orden === 'precio-desc') {
        return Number(b.price) - Number(a.price);
      }

      if (orden === 'nombre') {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });

  return (
    <section className='pagina catalogo'>
      <h1>Catálogo de productos</h1>

      <p>Encontrá todo lo que necesitás para tu hogar.</p>

      <div className='catalogo__filtros'>
        {/* Buscador */}
        <div>
          <label htmlFor='busqueda'>Buscar producto</label>

          <input
            id='busqueda'
            type='search'
            placeholder='Buscar por nombre...'
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor='categoria'>Categoría</label>

          <select
            id='categoria'
            value={categoriaValida}
            onChange={e => setCategoria(e.target.value)}
          >
            <option value=''>Todas las categorías</option>

            {categorias.map(nombre => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Precio máximo */}
        <div>
          <label htmlFor='precio'>Precio máximo</label>

          <input
            id='precio'
            type='number'
            min='0'
            placeholder='Sin límite'
            value={precioMaximo}
            onChange={e => setPrecioMaximo(e.target.value)}
          />
        </div>

        {/* Ordenamiento */}
        <div>
          <label htmlFor='orden'>Ordenar por</label>

          <select id='orden' value={orden} onChange={e => setOrden(e.target.value)}>
            <option value=''>Sin ordenar</option>
            <option value='precio-asc'>Menor precio</option>
            <option value='precio-desc'>Mayor precio</option>
            <option value='nombre'>Nombre (A-Z)</option>
          </select>
        </div>

        {/* Disponibilidad */}
        <label className='catalogo__disponibles'>
          <input
            type='checkbox'
            checked={soloDisponibles}
            onChange={e => setSoloDisponibles(e.target.checked)}
          />
          Solo productos disponibles
        </label>
      </div>

      {/* Resultados: mientras carga se muestran tarjetas "esqueleto" */}
      {cargando && (
        <div aria-busy='true'>
          <p className='aviso-servidor'>
            Estamos despertando el servidor. La primera carga puede tardar unos segundos.
          </p>

          <div className='productos__grid'>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(n => (
              <div className='esqueleto esqueleto--tarjeta' key={n} />
            ))}
          </div>
        </div>
      )}

      {error && <p role='alert'>{error}</p>}

      {!cargando && !error && (
        <>
          <p className='catalogo__cantidad'>
            {productosFiltrados.length}{' '}
            {productosFiltrados.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>

          {productosFiltrados.length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            <div className='productos__grid'>
              {productosFiltrados.map((producto, indice) => (
                <ProductCard key={producto._id} producto={producto} indice={indice} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Catalogo;
