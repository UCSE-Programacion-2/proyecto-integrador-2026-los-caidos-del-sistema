
/* ========================================
   PANEL ADMIN CRUD — BALBI HOME
   HU-S3-08 | Issue #64
   ======================================== */

const ADMIN_API_URL = 'http://localhost:4000/api/products';

let productosAdmin = [];
let productoEnEdicion = null;
let productoPendienteEliminar = null;
let elementoAnteriorModal = null;
let eliminacionEnCurso = false;

const formatoPrecioAdmin = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 2,
});

// ========================================
// MENSAJES
// ========================================

function mostrarMensajeAdmin(id, texto, esError = false) {
  const elemento = document.getElementById(id);
  elemento.textContent = texto;
  elemento.style.color = esError ? '#b42318' : '#26734d';
}

// ========================================
// COMUNICACIÓN CON LA API
// ========================================

async function solicitarAdmin(url, opciones = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    ...opciones.headers,
  };

  if (opciones.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(url, {
    ...opciones,
    headers,
  });

  let datos;

  try {
    datos = await respuesta.json();
  } catch {
    throw new Error('El servidor devolvió una respuesta inválida.');
  }

  if (!respuesta.ok) {
    throw new Error(
      datos.error?.message ||
      datos.message ||
      'Ocurrió un error al comunicarse con el servidor.'
    );
  }

  return datos;
}

// ========================================
// LISTAR PRODUCTOS
// ========================================

async function cargarProductosAdmin() {
  mostrarMensajeAdmin(
    'admin-tabla-mensaje',
    'Cargando productos...'
  );

  try {
    const datos = await solicitarAdmin(ADMIN_API_URL);

    if (!Array.isArray(datos.products)) {
      throw new Error('La API no devolvió una lista de productos válida.');
    }

    productosAdmin = datos.products;

    renderizarProductosAdmin();

    mostrarMensajeAdmin('admin-tabla-mensaje', '');
  } catch (error) {
    productosAdmin = [];
    renderizarProductosAdmin();

    mostrarMensajeAdmin(
      'admin-tabla-mensaje',
      error.message,
      true
    );
  }
}

function crearBotonAdmin(texto, accion, id) {
  const boton = document.createElement('button');

  boton.type = 'button';
  boton.textContent = texto;
  boton.dataset.accion = accion;
  boton.dataset.id = id;

  return boton;
}

function renderizarProductosAdmin() {
  const cuerpo = document.getElementById('admin-productos');
  const total = document.getElementById('admin-total');

  cuerpo.replaceChildren();

  total.textContent =
    `${productosAdmin.length} ` +
    (productosAdmin.length === 1 ? 'producto' : 'productos');

  if (productosAdmin.length === 0) {
    const fila = document.createElement('tr');
    const celda = document.createElement('td');

    celda.colSpan = 5;
    celda.textContent = 'No hay productos registrados.';

    fila.appendChild(celda);
    cuerpo.appendChild(fila);

    return;
  }

  productosAdmin.forEach((producto) => {
    const fila = document.createElement('tr');

    const nombre = document.createElement('td');
    nombre.textContent = producto.name;

    const categoria = document.createElement('td');
    categoria.textContent = producto.category;

    const precio = document.createElement('td');
    precio.textContent = formatoPrecioAdmin.format(producto.price);

    const stock = document.createElement('td');
    stock.textContent = producto.stock;

    const acciones = document.createElement('td');
    acciones.className = 'admin__acciones';

    acciones.append(
      crearBotonAdmin('Ver', 'ver', producto._id),
      crearBotonAdmin('Editar', 'editar', producto._id),
      crearBotonAdmin('Eliminar', 'eliminar', producto._id)
    );

    fila.append(
      nombre,
      categoria,
      precio,
      stock,
      acciones
    );

    cuerpo.appendChild(fila);
  });
}

// ========================================
// VALIDACIONES
// ========================================

function obtenerDatosFormularioAdmin() {
  const name = document.getElementById('nombre').value.trim();
  const category = document.getElementById('categoria').value;
  const description = document.getElementById('descripcion').value.trim();
  const precioTexto = document.getElementById('precio').value.trim();
  const stockTexto = document.getElementById('stock').value.trim();
  const image = document.getElementById('imagen').value.trim();

  if (
    !name ||
    !description ||
    !category ||
    precioTexto === '' ||
    stockTexto === ''
  ) {
    throw new Error('Completá todos los campos obligatorios.');
  }

  const price = Number(precioTexto);
  const stock = Number(stockTexto);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('Ingresá un precio válido, mayor o igual a cero.');
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('El stock debe ser un número entero no negativo.');
  }

  if (image) {
    try {
      const url = new URL(image);

      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Protocolo no permitido');
      }
    } catch {
      throw new Error('La imagen debe tener una URL válida.');
    }
  }

  return {
    name,
    description,
    price,
    category,
    stock,
    image,
  };
}

// ========================================
// CREAR Y EDITAR PRODUCTOS
// ========================================

async function guardarProductoAdmin(evento) {
  evento.preventDefault();

  const boton = document.getElementById('admin-guardar');

  try {
    const producto = obtenerDatosFormularioAdmin();

    boton.disabled = true;

    const editando = productoEnEdicion !== null;

    const url = editando
      ? `${ADMIN_API_URL}/${productoEnEdicion}`
      : ADMIN_API_URL;

    const metodo = editando ? 'PUT' : 'POST';

    await solicitarAdmin(url, {
      method: metodo,
      body: JSON.stringify(producto),
    });

    cancelarEdicionAdmin();

    mostrarMensajeAdmin(
      'admin-form-mensaje',
      editando
        ? 'Producto actualizado correctamente.'
        : 'Producto creado correctamente.'
    );

    await cargarProductosAdmin();
  } catch (error) {
    mostrarMensajeAdmin(
      'admin-form-mensaje',
      error.message,
      true
    );
  } finally {
    boton.disabled = false;
  }
}

function editarProductoAdmin(id) {
  const producto = productosAdmin.find((item) => item._id === id);

  if (!producto) {
    mostrarMensajeAdmin(
      'admin-tabla-mensaje',
      'No se encontró el producto seleccionado.',
      true
    );
    return;
  }

  productoEnEdicion = id;

  document.getElementById('nombre').value = producto.name;
  document.getElementById('categoria').value = producto.category;
  document.getElementById('precio').value = producto.price;
  document.getElementById('stock').value = producto.stock;
  document.getElementById('descripcion').value = producto.description;
  document.getElementById('imagen').value = producto.image || '';

  document.getElementById('admin-form-titulo').textContent =
    'Editar producto';

  document.getElementById('admin-guardar').textContent =
    'Guardar cambios';

  document.getElementById('admin-cancelar').hidden = false;

  mostrarMensajeAdmin('admin-form-mensaje', '');

  document.getElementById('admin-form').scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

function cancelarEdicionAdmin() {
  productoEnEdicion = null;

  document.getElementById('admin-form').reset();

  document.getElementById('admin-form-titulo').textContent =
    'Crear producto';

  document.getElementById('admin-guardar').textContent =
    'Guardar producto';

  document.getElementById('admin-cancelar').hidden = true;

  mostrarMensajeAdmin('admin-form-mensaje', '');
}

// ========================================
// MODAL PERSONALIZADO
// ========================================

function abrirModalAdmin() {
  const modal = document.getElementById('admin-modal');

  elementoAnteriorModal = document.activeElement;
  modal.hidden = false;

  document.getElementById('admin-modal-cerrar').focus();
}

function cerrarModalAdmin() {
  if (eliminacionEnCurso) {
    return;
  }

  document.getElementById('admin-modal').hidden = true;

  document.getElementById('admin-modal-detalle').replaceChildren();
  document.getElementById('admin-modal-detalle').hidden = true;

  document.getElementById('admin-modal-mensaje').textContent = '';

  document.getElementById('admin-modal-confirmar').hidden = true;
  document.getElementById('admin-modal-cancelar').textContent = 'Cerrar';

  productoPendienteEliminar = null;

  if (
    elementoAnteriorModal &&
    elementoAnteriorModal.isConnected
  ) {
    elementoAnteriorModal.focus();
  }

  elementoAnteriorModal = null;
}

function crearDatoModalAdmin(etiqueta, valor) {
  const parrafo = document.createElement('p');
  parrafo.className = 'admin-modal__dato';

  const destacado = document.createElement('strong');
  destacado.textContent = `${etiqueta}: `;

  parrafo.append(destacado, document.createTextNode(String(valor)));

  return parrafo;
}

// ========================================
// MODAL VER PRODUCTO
// ========================================

function verProductoAdmin(id) {
  const producto = productosAdmin.find((item) => item._id === id);

  if (!producto) {
    mostrarMensajeAdmin(
      'admin-tabla-mensaje',
      'No se encontró el producto seleccionado.',
      true
    );
    return;
  }

  productoPendienteEliminar = null;

  document.getElementById('admin-modal-titulo').textContent =
    'Detalle del producto';

  const detalle = document.getElementById('admin-modal-detalle');
  detalle.replaceChildren();
  detalle.hidden = false;

  if (producto.image) {
    const imagen = document.createElement('img');

    imagen.src = producto.image;
    imagen.alt = producto.name;
    imagen.className = 'admin-modal__imagen';

    detalle.appendChild(imagen);
  }

  detalle.append(
    crearDatoModalAdmin('Nombre', producto.name),
    crearDatoModalAdmin('Categoría', producto.category),
    crearDatoModalAdmin(
      'Precio',
      formatoPrecioAdmin.format(producto.price)
    ),
    crearDatoModalAdmin('Stock', producto.stock),
    crearDatoModalAdmin('Descripción', producto.description)
  );

  document.getElementById('admin-modal-mensaje').textContent = '';

  document.getElementById('admin-modal-cancelar').textContent =
    'Cerrar';

  document.getElementById('admin-modal-confirmar').hidden = true;

  abrirModalAdmin();
}

// ========================================
// MODAL ELIMINAR PRODUCTO
// ========================================

function eliminarProductoAdmin(id) {
  const producto = productosAdmin.find((item) => item._id === id);

  if (!producto) {
    mostrarMensajeAdmin(
      'admin-tabla-mensaje',
      'No se encontró el producto seleccionado.',
      true
    );
    return;
  }

  productoPendienteEliminar = id;

  document.getElementById('admin-modal-titulo').textContent =
    '¿Eliminar producto?';

  document.getElementById('admin-modal-detalle').hidden = true;

  document.getElementById('admin-modal-mensaje').textContent =
    `¿Estás seguro de que querés eliminar "${producto.name}"? ` +
    'Esta acción no se puede deshacer.';

  document.getElementById('admin-modal-cancelar').textContent =
    'Cancelar';

  document.getElementById('admin-modal-confirmar').hidden = false;

  abrirModalAdmin();
}

async function confirmarEliminacionAdmin() {
  if (!productoPendienteEliminar || eliminacionEnCurso) {
    return;
  }

  const id = productoPendienteEliminar;
  const boton = document.getElementById('admin-modal-confirmar');

  eliminacionEnCurso = true;
  boton.disabled = true;
  boton.textContent = 'Eliminando...';

  try {
    await solicitarAdmin(`${ADMIN_API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (productoEnEdicion === id) {
      cancelarEdicionAdmin();
    }

    eliminacionEnCurso = false;
    cerrarModalAdmin();

    await cargarProductosAdmin();

    mostrarMensajeAdmin(
      'admin-tabla-mensaje',
      'Producto eliminado correctamente.'
    );
  } catch (error) {
    document.getElementById('admin-modal-mensaje').textContent =
      error.message;
  } finally {
    eliminacionEnCurso = false;
    boton.disabled = false;
    boton.textContent = 'Eliminar producto';
  }
}

// ========================================
// ACCIONES DE LA TABLA
// ========================================

function manejarAccionesAdmin(evento) {
  const boton = evento.target.closest('button[data-accion]');

  if (!boton) {
    return;
  }

  const { accion, id } = boton.dataset;

  if (accion === 'ver') {
    verProductoAdmin(id);
  } else if (accion === 'editar') {
    editarProductoAdmin(id);
  } else if (accion === 'eliminar') {
    eliminarProductoAdmin(id);
  }
}

// ========================================
// EVENTOS DEL MODAL
// ========================================

function manejarTecladoModalAdmin(evento) {
  const modal = document.getElementById('admin-modal');

  if (modal.hidden) {
    return;
  }

  if (evento.key === 'Escape') {
    evento.preventDefault();
    cerrarModalAdmin();
  }

  if (evento.key === 'Tab') {
    const botones = Array.from(
      modal.querySelectorAll('button:not([hidden]):not(:disabled)')
    );

    if (botones.length === 0) {
      return;
    }

    const primero = botones[0];
    const ultimo = botones[botones.length - 1];

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (
      !evento.shiftKey &&
      document.activeElement === ultimo
    ) {
      evento.preventDefault();
      primero.focus();
    }
  }
}

// ========================================
// CONTROL DE ACCESO AL PANEL
// ========================================

function verificarAccesoAdmin() {
  const token = localStorage.getItem('token');
  const usuarioGuardado = localStorage.getItem('user');

  if (!token || !usuarioGuardado) {
    window.location.replace('index.html');
    return false;
  }

  try {
    const usuario = JSON.parse(usuarioGuardado);

    if (usuario.role !== 'admin') {
      window.location.replace('index.html');
      return false;
    }

    return true;
  } catch (error) {
    window.location.replace('index.html');
    return false;
  }
}

// ========================================
// INICIALIZACIÓN
// ========================================

function inicializarAdmin() {
      // Verificar que el usuario sea administrador
  if (!verificarAccesoAdmin()) {
    return;
  }
  document.getElementById('admin-form')
    .addEventListener('submit', guardarProductoAdmin);

  document.getElementById('admin-cancelar')
    .addEventListener('click', cancelarEdicionAdmin);

  document.getElementById('admin-productos')
    .addEventListener('click', manejarAccionesAdmin);

  document.getElementById('admin-modal-cerrar')
    .addEventListener('click', cerrarModalAdmin);

  document.getElementById('admin-modal-cancelar')
    .addEventListener('click', cerrarModalAdmin);

  document.getElementById('admin-modal-confirmar')
    .addEventListener('click', confirmarEliminacionAdmin);

  document.getElementById('admin-modal')
    .addEventListener('click', (evento) => {
      if (evento.target.id === 'admin-modal') {
        cerrarModalAdmin();
      }
    });

  document.addEventListener('keydown', manejarTecladoModalAdmin);

  cargarProductosAdmin();
}

document.addEventListener('DOMContentLoaded', inicializarAdmin);
