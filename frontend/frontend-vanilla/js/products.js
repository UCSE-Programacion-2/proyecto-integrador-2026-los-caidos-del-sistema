
 // Dirección del backend de Balbi Home
const API_PRODUCTS_URL = 'http://localhost:4000/api/products';

// Contenedor donde se mostrarán los productos
const productosContainer = document.getElementById('productos-container');

// Contador de productos (solo existe en catalogo.html)
const productosTotal = document.getElementById('productos-total');

// Controles de filtros y ordenamiento del catálogo
const botonAplicarFiltros = document.getElementById('aplicar-filtros');
const selectorOrden = document.getElementById('orden');

// Guardamos los productos originales obtenidos desde la API
let productosOriginales = [];

// Guardamos los filtros que el usuario aplicó
let filtrosAplicados = {
  categorias: [],
  precio: null,
  disponibilidad: []
};

// Función para mostrar las tarjetas de productos
const mostrarProductos = (productos) => {
  productosContainer.innerHTML = '';

  // Actualizamos el contador con la cantidad de productos visibles
  if (productosTotal) {
    productosTotal.textContent = productos.length;
  }

  // Mostramos un mensaje cuando no hay resultados
  if (productos.length === 0) {
    productosContainer.textContent =
      'No se encontraron productos con los filtros seleccionados.';
    return;
  }

  // Recorremos los productos y creamos sus tarjetas
  productos.forEach((producto) => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('producto__card');

    const imagen = document.createElement('div');
    imagen.classList.add('producto__img');

    if (producto.image) {
      const img = document.createElement('img');
      img.src = producto.image;
      img.alt = producto.name;
      imagen.appendChild(img);
    } else {
      imagen.textContent = '📦';
    }

    const info = document.createElement('div');
    info.classList.add('producto__info');

    const categoria = document.createElement('span');
    categoria.classList.add('producto__categoria');
    categoria.textContent = producto.category || 'Sin categoría';

    const nombre = document.createElement('h3');
    nombre.classList.add('producto__nombre');
    nombre.textContent = producto.name;

    const precio = document.createElement('p');
    precio.classList.add('producto__precio');
    precio.textContent =
      `$${Number(producto.price).toLocaleString('es-AR')}`;

    const enlace = document.createElement('a');
    enlace.classList.add('btn', 'btn--outline');
    enlace.href = `detalle.html?id=${encodeURIComponent(producto._id)}`;
    enlace.textContent = 'Ver Detalle';

    info.appendChild(categoria);
    info.appendChild(nombre);
    info.appendChild(precio);
    info.appendChild(enlace);

    tarjeta.appendChild(imagen);
    tarjeta.appendChild(info);

    productosContainer.appendChild(tarjeta);
  });
};

// Función para leer los filtros seleccionados en el HTML
const obtenerFiltrosSeleccionados = () => {
  const categorias = Array.from(
    document.querySelectorAll('input[name="categoria"]:checked')
  ).map((input) => input.value);

  const precioSeleccionado = document.querySelector(
    'input[name="precio"]:checked'
  );

  const disponibilidad = Array.from(
    document.querySelectorAll('input[name="disponibilidad"]:checked')
  ).map((input) => input.value);

  return {
    categorias,
    precio: precioSeleccionado ? precioSeleccionado.value : null,
    disponibilidad
  };
};

// Función para filtrar los productos
const filtrarProductos = (productos) => {
  return productos.filter((producto) => {
    // FILTRO POR CATEGORÍA
    // Si no se selecciona ninguna categoría, se muestran todas.
    const cumpleCategoria =
      filtrosAplicados.categorias.length === 0 ||
      filtrosAplicados.categorias.some(
        (categoria) =>
          categoria.toLocaleLowerCase('es') ===
          String(producto.category || '').toLocaleLowerCase('es')
      );

    // FILTRO POR PRECIO
    const precioProducto = Number(producto.price);
    let cumplePrecio = true;

    if (filtrosAplicados.precio === 'hasta-10000') {
      cumplePrecio = precioProducto <= 10000;
    } else if (filtrosAplicados.precio === '10000-25000') {
      cumplePrecio = precioProducto > 10000 && precioProducto <= 25000;
    } else if (filtrosAplicados.precio === 'mas-25000') {
      cumplePrecio = precioProducto > 25000;
    }

    // FILTRO POR DISPONIBILIDAD
    const stockProducto = Number(producto.stock);

    const cumpleDisponibilidad =
      filtrosAplicados.disponibilidad.length === 0 ||
      (filtrosAplicados.disponibilidad.includes('en-stock') &&
        stockProducto > 0) ||
      (filtrosAplicados.disponibilidad.includes('sin-stock') &&
        stockProducto === 0);

    // El producto debe cumplir todos los grupos de filtros
    return cumpleCategoria && cumplePrecio && cumpleDisponibilidad;
  });
};

// Función para ordenar los productos visibles
const ordenarProductos = (productos) => {
  const productosOrdenados = [...productos];
  const tipoOrden = selectorOrden ? selectorOrden.value : 'relevantes';

  if (tipoOrden === 'precio-asc') {
    productosOrdenados.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  } else if (tipoOrden === 'precio-desc') {
    productosOrdenados.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  } else if (tipoOrden === 'nombre-asc') {
    productosOrdenados.sort((a, b) =>
      String(a.name).localeCompare(String(b.name), 'es', {
        sensitivity: 'base'
      })
    );
  }

  // "Más relevantes" conserva el orden original de la API
  return productosOrdenados;
};

// Función para aplicar filtros y ordenamiento
const actualizarCatalogo = () => {
  const productosFiltrados = filtrarProductos(productosOriginales);
  const productosOrdenados = ordenarProductos(productosFiltrados);

  mostrarProductos(productosOrdenados);
};

// Función para cargar los productos desde la API
const cargarProductos = async () => {
  try {
    const respuesta = await fetch(API_PRODUCTS_URL);

    if (!respuesta.ok) {
      throw new Error('No se pudieron obtener los productos');
    }

    const data = await respuesta.json();

    // Conservamos el listado original para filtrar sin repetir peticiones
    productosOriginales = Array.isArray(data.products)
      ? data.products
      : [];

    // Mostramos inicialmente todos los productos
    if (productosOriginales.length === 0) {
      productosContainer.textContent = 'No hay productos disponibles.';

      if (productosTotal) {
        productosTotal.textContent = 0;
      }

      return;
    }

    actualizarCatalogo();
  } catch (error) {
    console.error('Error al cargar productos:', error);

    productosContainer.textContent =
      'No se pudieron cargar los productos. Intentá nuevamente más tarde.';

    if (productosTotal) {
      productosTotal.textContent = 0;
    }
  }
};

// Al presionar "Aplicar filtros", leemos las opciones seleccionadas
if (botonAplicarFiltros) {
  botonAplicarFiltros.addEventListener('click', () => {
    filtrosAplicados = obtenerFiltrosSeleccionados();
    actualizarCatalogo();
  });
}

// Botón para limpiar todos los filtros y recuperar el catálogo completo
const botonLimpiarFiltros = document.getElementById('limpiar-filtros');

if (botonLimpiarFiltros) {
  botonLimpiarFiltros.addEventListener('click', () => {
    // Desmarcamos todas las categorías
    document.querySelectorAll('input[name="categoria"]').forEach((input) => {
      input.checked = false;
    });

    // Desmarcamos todos los rangos de precio
    document.querySelectorAll('input[name="precio"]').forEach((input) => {
      input.checked = false;
    });

    // Desmarcamos las opciones de disponibilidad
    document.querySelectorAll('input[name="disponibilidad"]').forEach((input) => {
      input.checked = false;
    });

    // Restablecemos los filtros aplicados
    filtrosAplicados = {
      categorias: [],
      precio: null,
      disponibilidad: []
    };

    // Recuperamos el ordenamiento original
    if (selectorOrden) {
      selectorOrden.value = 'relevantes';
    }

    // Volvemos a mostrar todos los productos
    actualizarCatalogo();
  });
}

// Al cambiar el ordenamiento, actualizamos las tarjetas automáticamente
if (selectorOrden) {
  selectorOrden.addEventListener('change', () => {
    actualizarCatalogo();
  });
}

// Ejecutamos la función al cargar la página
if (productosContainer) {
  cargarProductos();
}
