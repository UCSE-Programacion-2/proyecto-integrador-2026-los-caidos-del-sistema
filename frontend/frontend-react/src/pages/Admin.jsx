import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../services/api';
import { formatearPrecio } from '../utils/formato';
import '../styles/admin.css';

// =====================================================
// VALORES INICIALES DEL FORMULARIO
// =====================================================

const formularioInicial = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  image: '',
};

// Categorías permitidas por el backend.
const categorias = ['Bazar', 'Decoración', 'Blanco', 'Electrodomésticos'];

function Admin() {
  // =====================================================
  // 1. ESTADOS DEL COMPONENTE
  // =====================================================

  // Productos obtenidos desde MongoDB mediante la API.
  const [productos, setProductos] = useState([]);

  // Estados del listado.
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Datos del formulario.
  const [formulario, setFormulario] = useState({
    ...formularioInicial,
  });

  // ID del producto que se está editando.
  // Si es null, el formulario sirve para agregar productos.
  const [productoEditando, setProductoEditando] = useState(null);

  // Controla el envío del formulario.
  const [guardando, setGuardando] = useState(false);

  // Producto seleccionado para consultar sus detalles.
  const [productoAVer, setProductoAVer] = useState(null);

  // Producto seleccionado para confirmar su eliminación.
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // ID del producto cuya eliminación está en proceso.
  const [productoEliminando, setProductoEliminando] = useState(null);

  // Mensajes del panel.
  const [mensaje, setMensaje] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');

  // Referencias para controlar el foco de los modales.
  const modalRef = useRef(null);
  const botonCerrarRef = useRef(null);
  const botonOrigenRef = useRef(null);

  // Determina si hay algún modal abierto.
  const modalAbierto = productoAVer !== null || productoAEliminar !== null;

  // =====================================================
  // 2. CONSULTAR PRODUCTOS
  // GET /api/products
  // =====================================================

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError('');

        const datos = await apiFetch('/products');

        // El backend devuelve un objeto con la propiedad products.
        setProductos(datos.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  // =====================================================
  // 3. CONTROLAR LOS MODALES
  // =====================================================

  useEffect(() => {
    if (!modalAbierto) {
      return undefined;
    }

    // Guardamos el desplazamiento anterior de la página.
    const overflowAnterior = document.body.style.overflow;

    // Bloqueamos el scroll de la página de fondo.
    document.body.style.overflow = 'hidden';

    // Enfocamos el primer botón del modal.
    botonCerrarRef.current?.focus();

    const manejarTeclado = evento => {
      // Escape cierra el modal si no hay una eliminación en curso.
      if (evento.key === 'Escape') {
        if (productoEliminando === null) {
          evento.preventDefault();
          setProductoAVer(null);
          setProductoAEliminar(null);
        }

        return;
      }

      // Mantenemos el foco dentro del modal.
      if (evento.key === 'Tab' && modalRef.current) {
        const elementos = modalRef.current.querySelectorAll(
          'button:not(:disabled), a[href], input:not(:disabled)',
        );

        if (elementos.length === 0) {
          return;
        }

        const primero = elementos[0];
        const ultimo = elementos[elementos.length - 1];

        if (evento.shiftKey && document.activeElement === primero) {
          evento.preventDefault();
          ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primero.focus();
        }
      }
    };

    document.addEventListener('keydown', manejarTeclado);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener('keydown', manejarTeclado);
    };
  }, [modalAbierto, productoEliminando]);

  // =====================================================
  // 4. ACTUALIZAR LOS CAMPOS DEL FORMULARIO
  // =====================================================

  const manejarCambio = evento => {
    const { name, value } = evento.target;

    setFormulario(anterior => ({
      ...anterior,
      [name]: value,
    }));
  };

  // =====================================================
  // 5. VALIDAR LOS DATOS DEL PRODUCTO
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
  // 6. SELECCIONAR PRODUCTO PARA EDITAR
  // =====================================================

  const editarProducto = producto => {
    setProductoEditando(producto._id);

    // Cargamos los datos existentes en el formulario.
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

    // Llevamos al administrador al formulario.
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // =====================================================
  // 7. CANCELAR EDICIÓN
  // =====================================================

  const cancelarEdicion = () => {
    setProductoEditando(null);
    setFormulario({ ...formularioInicial });

    setMensaje('');
    setErrorFormulario('');
  };

  // =====================================================
  // 8. AGREGAR O ACTUALIZAR PRODUCTO
  // POST /api/products
  // PUT /api/products/:id
  // =====================================================

  const guardarProducto = async evento => {
    evento.preventDefault();

    setMensaje('');
    setErrorFormulario('');

    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setErrorFormulario(errorValidacion);
      return;
    }

    // Preparamos los datos para enviarlos al backend.
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
        // UPDATE: modificar un producto existente.
        const datos = await apiFetch(`/products/${productoEditando}`, {
          method: 'PUT',
          body: JSON.stringify(datosProducto),
        });

        // Actualizamos el producto en la tabla.
        setProductos(anteriores =>
          anteriores.map(producto =>
            producto._id === productoEditando ? datos.product : producto,
          ),
        );

        setMensaje('Producto actualizado correctamente.');
      } else {
        // CREATE: agregar un nuevo producto.
        const datos = await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(datosProducto),
        });

        // Incorporamos el producto creado al listado.
        setProductos(anteriores => [...anteriores, datos.product]);

        setMensaje('Producto agregado correctamente.');
      }

      // Limpiamos el formulario después de guardar.
      setFormulario({ ...formularioInicial });
      setProductoEditando(null);
    } catch (err) {
      setErrorFormulario(err.message);
    } finally {
      setGuardando(false);
    }
  };

  // =====================================================
  // 9. ABRIR MODAL PARA VER UN PRODUCTO
  // =====================================================

  const abrirModalDetalle = (producto, evento) => {
    // Recordamos el botón que abrió el modal.
    botonOrigenRef.current = evento.currentTarget;

    // Guardamos el producto seleccionado.
    setProductoAVer(producto);

    setMensaje('');
    setErrorFormulario('');
  };

  // =====================================================
  // 10. ABRIR MODAL PARA ELIMINAR UN PRODUCTO
  // =====================================================

  const abrirModalEliminar = (producto, evento) => {
    botonOrigenRef.current = evento.currentTarget;

    setProductoAEliminar(producto);

    setMensaje('');
    setErrorFormulario('');
  };

  // =====================================================
  // 11. CERRAR CUALQUIER MODAL
  // =====================================================

  const cerrarModal = () => {
    // No cerramos mientras se procesa una eliminación.
    if (productoEliminando !== null) {
      return;
    }

    setProductoAVer(null);
    setProductoAEliminar(null);

    // Devolvemos el foco al botón que abrió el modal.
    requestAnimationFrame(() => {
      botonOrigenRef.current?.focus();
    });
  };

  // =====================================================
  // 12. ELIMINAR PRODUCTO
  // DELETE /api/products/:id
  // =====================================================

  const confirmarEliminacion = async () => {
    if (!productoAEliminar || productoEliminando !== null) {
      return;
    }

    const producto = productoAEliminar;

    setMensaje('');
    setErrorFormulario('');

    try {
      setProductoEliminando(producto._id);

      // Solicitamos al backend eliminar el producto.
      await apiFetch(`/products/${producto._id}`, {
        method: 'DELETE',
      });

      // Quitamos el producto de la tabla.
      setProductos(anteriores => anteriores.filter(item => item._id !== producto._id));

      // Si se estaba editando, limpiamos el formulario.
      if (productoEditando === producto._id) {
        setProductoEditando(null);
        setFormulario({ ...formularioInicial });
      }

      setMensaje('Producto eliminado correctamente.');

      // Cerramos el modal.
      setProductoAEliminar(null);
    } catch (err) {
      setErrorFormulario(err.message);
      setProductoAEliminar(null);
    } finally {
      setProductoEliminando(null);
    }
  };

  // Texto del botón principal según lo que esté pasando
  let textoBotonGuardar = 'Agregar producto';

  if (guardando) {
    textoBotonGuardar = 'Guardando...';
  } else if (productoEditando) {
    textoBotonGuardar = 'Guardar cambios';
  }

  // =====================================================
  // 13. INTERFAZ DEL PANEL ADMINISTRATIVO
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
        <h2>{productoEditando ? 'Editar producto' : 'Agregar producto'}</h2>

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

              {categorias.map(categoria => (
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
            <label htmlFor='imagen-producto'>URL de la imagen (opcional)</label>

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
              {textoBotonGuardar}
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

        {cargando && <p>Cargando productos...</p>}

        {error && (
          <p className='admin-message admin-message--error' role='alert'>
            Error: {error}
          </p>
        )}

        {!cargando &&
          !error &&
          (productos.length === 0 ? (
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
                  {productos.map(producto => (
                    <tr key={producto._id}>
                      <td>{producto.name}</td>
                      <td>{producto.category}</td>
                      <td>{formatearPrecio(producto.price)}</td>
                      <td>{producto.stock}</td>

                      <td>
                        <div className='admin-table__actions'>
                          {/* VER DETALLE */}
                          <button
                            className='admin-btn admin-btn--view'
                            type='button'
                            onClick={evento => abrirModalDetalle(producto, evento)}
                            disabled={guardando || productoEliminando !== null}
                          >
                            Ver
                          </button>

                          {/* EDITAR */}
                          <button
                            className='admin-btn admin-btn--edit'
                            type='button'
                            onClick={() => editarProducto(producto)}
                            disabled={guardando || productoEliminando !== null}
                          >
                            Editar
                          </button>

                          {/* ELIMINAR */}
                          <button
                            className='admin-btn admin-btn--delete'
                            type='button'
                            onClick={evento => abrirModalEliminar(producto, evento)}
                            disabled={guardando || productoEliminando !== null}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </section>

      {/* ============================================
          MODAL PARA VER DETALLES DEL PRODUCTO
          ============================================ */}

      {productoAVer && (
        <div
          className='admin-modal-overlay'
          role='presentation'
          onMouseDown={evento => {
            if (evento.target === evento.currentTarget) {
              cerrarModal();
            }
          }}
        >
          <div
            ref={modalRef}
            className='admin-modal admin-modal--detalle'
            role='dialog'
            aria-modal='true'
            aria-labelledby='admin-detalle-titulo'
          >
            {/* TÍTULO */}
            <h2 id='admin-detalle-titulo'>Detalle del producto</h2>

            {/* IMAGEN */}
            {productoAVer.image ? (
              <img
                className='admin-detalle__imagen'
                src={productoAVer.image}
                alt={productoAVer.name}
              />
            ) : (
              <div className='admin-detalle__sin-imagen'>Imagen no disponible</div>
            )}

            {/* DATOS DEL PRODUCTO */}
            <div className='admin-detalle__informacion'>
              <h3>{productoAVer.name}</h3>

              <p>
                <strong>Categoría:</strong> {productoAVer.category}
              </p>

              <p>
                <strong>Descripción:</strong> {productoAVer.description}
              </p>

              <p>
                <strong>Precio:</strong> {formatearPrecio(productoAVer.price)}
              </p>

              <p>
                <strong>Stock:</strong> {productoAVer.stock} unidades
              </p>
            </div>

            {/* CERRAR */}
            <div className='admin-modal__acciones'>
              <button
                ref={botonCerrarRef}
                className='admin-btn admin-btn--primary'
                type='button'
                onClick={cerrarModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          MODAL PARA CONFIRMAR ELIMINACIÓN
          ============================================ */}

      {productoAEliminar && (
        <div
          className='admin-modal-overlay'
          role='presentation'
          onMouseDown={evento => {
            if (evento.target === evento.currentTarget) {
              cerrarModal();
            }
          }}
        >
          <div
            ref={modalRef}
            className='admin-modal'
            role='alertdialog'
            aria-modal='true'
            aria-labelledby='admin-eliminar-titulo'
            aria-describedby='admin-eliminar-descripcion'
          >
            {/* ÍCONO DE ADVERTENCIA */}
            <div className='admin-modal__icono' aria-hidden='true'>
              !
            </div>

            {/* TÍTULO */}
            <h2 id='admin-eliminar-titulo'>¿Eliminar producto?</h2>

            {/* DESCRIPCIÓN */}
            <p id='admin-eliminar-descripcion'>
              ¿Estás segura de que querés eliminar <strong>«{productoAEliminar.name}»</strong>?
            </p>

            <p className='admin-modal__advertencia'>Esta acción no se puede deshacer.</p>

            {/* BOTONES */}
            <div className='admin-modal__acciones'>
              <button
                ref={botonCerrarRef}
                className='admin-btn admin-btn--secondary'
                type='button'
                onClick={cerrarModal}
                disabled={productoEliminando !== null}
              >
                Cancelar
              </button>

              <button
                className='admin-btn admin-btn--primary'
                type='button'
                onClick={confirmarEliminacion}
                disabled={productoEliminando !== null}
              >
                {productoEliminando !== null ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Admin;
