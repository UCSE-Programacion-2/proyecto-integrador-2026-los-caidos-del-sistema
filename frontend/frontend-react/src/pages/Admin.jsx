import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import '../styles/admin.css';

// Valores iniciales del formulario.
const formularioInicial = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  image: '',
};

// Categorías permitidas por el backend.
const categorias = [
  'Bazar',
  'Decoración',
  'Blanco',
  'Electrodomésticos',
];

function Admin() {
  // =====================================================
  // ESTADOS DEL COMPONENTE
  // =====================================================

  // Productos obtenidos desde la API.
  const [productos, setProductos] = useState([]);

  // Controlan la carga y los errores del listado.
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Datos ingresados en el formulario.
  const [formulario, setFormulario] = useState({ ...formularioInicial });

  // ID del producto seleccionado para editar.
  // Si es null, el formulario permite agregar productos.
  const [productoEditando, setProductoEditando] = useState(null);

  // Estados para controlar las operaciones.
  const [guardando, setGuardando] = useState(false);
  const [productoEliminando, setProductoEliminando] = useState(null);

  // Mensajes de éxito y error.
  const [mensaje, setMensaje] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');

  // =====================================================
  // 1. OBTENER PRODUCTOS
  // GET /api/products
  // =====================================================

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError('');

        const datos = await apiFetch('/products');

        // El backend devuelve { products: [...] }.
        setProductos(datos.products);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  // =====================================================
  // 2. ACTUALIZAR CAMPOS DEL FORMULARIO
  // =====================================================

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // =====================================================
  // 3. VALIDAR DATOS DEL PRODUCTO
  // =====================================================

  const validarFormulario = () => {
    if (!formulario.name.trim() || !formulario.description.trim()) {
      return 'El nombre y la descripción son obligatorios.';
    }

    if (!categorias.includes(formulario.category)) {
      return 'Debés seleccionar una categoría válida.';
    }

    if (
      formulario.price === '' ||
      !Number.isFinite(Number(formulario.price)) ||
      Number(formulario.price) < 0
    ) {
      return 'El precio debe ser un número mayor o igual a cero.';
    }

    if (
      formulario.stock === '' ||
      !Number.isInteger(Number(formulario.stock)) ||
      Number(formulario.stock) < 0
    ) {
      return 'El stock debe ser un número entero mayor o igual a cero.';
    }

    return '';
  };

  // =====================================================
  // 4. SELECCIONAR PRODUCTO PARA EDITAR
  // =====================================================

  const editarProducto = (producto) => {
    setProductoEditando(producto._id);

    // Cargamos los datos del producto en el formulario.
    setFormulario({
      name: producto.name,
      description: producto.description,
      price: String(producto.price),
      category: producto.category,
      stock: String(producto.stock),
      image: producto.image || '',
    });

    setMensaje('');
    setErrorFormulario('');

    // Desplazamos la página hacia el formulario.
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // =====================================================
  // 5. CANCELAR EDICIÓN
  // =====================================================

  const cancelarEdicion = () => {
    setProductoEditando(null);
    setFormulario({ ...formularioInicial });

    setMensaje('');
    setErrorFormulario('');
  };

  // =====================================================
  // 6. AGREGAR O EDITAR PRODUCTO
  // POST /api/products
  // PUT /api/products/:id
  // =====================================================

  const guardarProducto = async (evento) => {
    evento.preventDefault();

    setMensaje('');
    setErrorFormulario('');

    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setErrorFormulario(errorValidacion);
      return;
    }

    // Datos que espera el backend.
    const datosProducto = {
      name: formulario.name.trim(),
      description: formulario.description.trim(),
      price: Number(formulario.price),
      category: formulario.category,
      stock: Number(formulario.stock),
      image: formulario.image.trim(),
    };

    try {
      setGuardando(true);

      if (productoEditando) {
        // EDITAR: PUT /api/products/:id
        const datos = await apiFetch(`/products/${productoEditando}`, {
          method: 'PUT',
          body: JSON.stringify(datosProducto),
        });

        // Actualizamos el producto en la tabla.
        setProductos((anteriores) =>
          anteriores.map((producto) =>
            producto._id === productoEditando
              ? datos.product
              : producto
          )
        );

        setMensaje('Producto actualizado correctamente.');
      } else {
        // AGREGAR: POST /api/products
        const datos = await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(datosProducto),
        });

        // Incorporamos el nuevo producto al listado.
        setProductos((anteriores) => [
          ...anteriores,
          datos.product,
        ]);

        setMensaje('Producto agregado correctamente.');
      }

      // Limpiamos el formulario después de guardar.
      setFormulario({ ...formularioInicial });
      setProductoEditando(null);
    } catch (error) {
      setErrorFormulario(error.message);
    } finally {
      setGuardando(false);
    }
  };

  // =====================================================
  // 7. ELIMINAR PRODUCTO
  // DELETE /api/products/:id
  // =====================================================

  const eliminarProducto = async (producto) => {
    // Solicitamos confirmación antes de eliminar.
    const confirmado = window.confirm(
      `¿Estás seguro de que querés eliminar "${producto.name}"?`
    );

    if (!confirmado) {
      return;
    }

    setMensaje('');
    setErrorFormulario('');

    try {
      setProductoEliminando(producto._id);

      // Solicitamos al backend que elimine el producto.
      await apiFetch(`/products/${producto._id}`, {
        method: 'DELETE',
      });

      // Quitamos el producto eliminado de la tabla.
      setProductos((anteriores) =>
        anteriores.filter(
          (item) => item._id !== producto._id
        )
      );

      // Si estábamos editando el producto eliminado,
      // limpiamos el formulario.
      if (productoEditando === producto._id) {
        setProductoEditando(null);
        setFormulario({ ...formularioInicial });
      }

      setMensaje('Producto eliminado correctamente.');
    } catch (error) {
      setErrorFormulario(error.message);
    } finally {
      setProductoEliminando(null);
    }
  };

  // =====================================================
  // 8. INTERFAZ DEL PANEL ADMINISTRATIVO
  // =====================================================

  return (
    <section className='pagina admin-panel'>
      {/* ENCABEZADO */}
      <header className='admin-panel__header'>
        <h1>Panel de administración</h1>
        <p>Gestión de productos de Balbi Home.</p>
      </header>

      {/* ============================================
          FORMULARIO PARA AGREGAR O EDITAR PRODUCTOS
          ============================================ */}

      <section className='admin-panel__section'>
        <h2>
          {productoEditando
            ? 'Editar producto'
            : 'Agregar producto'}
        </h2>

        <form className='admin-form' onSubmit={guardarProducto}>
          {/* NOMBRE */}
          <div className='admin-form__field'>
            <label htmlFor='nombre-producto'>Nombre</label>

            <input
              id='nombre-producto'
              type='text'
              name='name'
              value={formulario.name}
              onChange={manejarCambio}
              required
            />
          </div>

          {/* CATEGORÍA */}
          <div className='admin-form__field'>
            <label htmlFor='categoria-producto'>Categoría</label>

            <select
              id='categoria-producto'
              name='category'
              value={formulario.category}
              onChange={manejarCambio}
              required
            >
              <option value=''>Seleccionar categoría</option>

              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPCIÓN */}
          <div className='admin-form__field admin-form__field--full'>
            <label htmlFor='descripcion-producto'>Descripción</label>

            <textarea
              id='descripcion-producto'
              name='description'
              value={formulario.description}
              onChange={manejarCambio}
              required
            />
          </div>

          {/* PRECIO */}
          <div className='admin-form__field'>
            <label htmlFor='precio-producto'>Precio</label>

            <input
              id='precio-producto'
              type='number'
              name='price'
              min='0'
              step='0.01'
              value={formulario.price}
              onChange={manejarCambio}
              required
            />
          </div>

          {/* STOCK */}
          <div className='admin-form__field'>
            <label htmlFor='stock-producto'>Stock</label>

            <input
              id='stock-producto'
              type='number'
              name='stock'
              min='0'
              step='1'
              value={formulario.stock}
              onChange={manejarCambio}
              required
            />
          </div>

          {/* IMAGEN */}
          <div className='admin-form__field admin-form__field--full'>
            <label htmlFor='imagen-producto'>
              URL de la imagen (opcional)
            </label>

            <input
              id='imagen-producto'
              type='text'
              name='image'
              value={formulario.image}
              onChange={manejarCambio}
              placeholder='https://...'
            />
          </div>

          {/* MENSAJES */}
          {mensaje && (
            <p className='admin-message admin-message--success' role='status'>
              {mensaje}
            </p>
          )}

          {errorFormulario && (
            <p className='admin-message admin-message--error' role='alert'>
              {errorFormulario}
            </p>
          )}

          {/* BOTONES DEL FORMULARIO */}
          <div className='admin-form__actions'>
            <button
              className='admin-btn admin-btn--primary'
              type='submit'
              disabled={guardando || productoEliminando !== null}
            >
              {guardando
                ? 'Guardando...'
                : productoEditando
                  ? 'Guardar cambios'
                  : 'Agregar producto'}
            </button>

            {productoEditando && (
              <button
                className='admin-btn admin-btn--secondary'
                type='button'
                onClick={cancelarEdicion}
                disabled={guardando || productoEliminando !== null}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ============================================
          LISTADO DE PRODUCTOS
          ============================================ */}

      <section className='admin-panel__section'>
        <h2>Listado de productos</h2>

        {/* MENSAJE DE CARGA */}
        {cargando && <p>Cargando productos...</p>}

        {/* ERROR AL CONSULTAR LA API */}
        {error && (
          <p className='admin-message admin-message--error' role='alert'>
            Error: {error}
          </p>
        )}

        {/* TABLA DE PRODUCTOS */}
        {!cargando && !error && (
          <>
            {productos.length === 0 ? (
              <p>No hay productos registrados.</p>
            ) : (
              <div className='admin-table-container'>
                <table className='admin-table'>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto._id}>
                        <td>{producto.name}</td>
                        <td>{producto.category}</td>
                        <td>${producto.price}</td>
                        <td>{producto.stock}</td>

                        <td>
                          <div className='admin-table__actions'>
                            {/* EDITAR */}
                            <button
                              className='admin-btn admin-btn--edit'
                              type='button'
                              onClick={() => editarProducto(producto)}
                              disabled={
                                guardando ||
                                productoEliminando !== null
                              }
                            >
                              Editar
                            </button>

                            {/* ELIMINAR */}
                            <button
                              className='admin-btn admin-btn--delete'
                              type='button'
                              onClick={() => eliminarProducto(producto)}
                              disabled={
                                guardando ||
                                productoEliminando !== null
                              }
                            >
                              {productoEliminando === producto._id
                                ? 'Eliminando...'
                                : 'Eliminar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </section>
  );
}

export default Admin;