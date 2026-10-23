// Dirección del backend de Balbi Home
const API_PRODUCTS_URL = 'http://localhost:4000/api/products';

// Contenedor donde se mostrarán los productos
const productosContainer = document.getElementById('productos-container');

// Contador de productos (solo existe en catalogo.html)
const productosTotal = document.getElementById('productos-total');

// Función para cargar los productos desde la API
const cargarProductos = async () => {
  try {
    const respuesta = await fetch(API_PRODUCTS_URL);

    if (!respuesta.ok) {
      throw new Error('No se pudieron obtener los productos');
    }

    const data = await respuesta.json();
    const productos = data.products;

    // Limpiamos el mensaje "Cargando productos..."
    productosContainer.innerHTML = '';

    // Actualizamos el contador del catálogo
    if (productosTotal) {
      productosTotal.textContent = productos ? productos.length : 0;
    }

    // Verificamos si hay productos disponibles
    if (!productos || productos.length === 0) {
      productosContainer.textContent = 'No hay productos disponibles.';
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
      precio.textContent = `$${Number(producto.price).toLocaleString('es-AR')}`;

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
  } catch (error) {
    console.error('Error al cargar productos:', error);
    productosContainer.textContent =
      'No se pudieron cargar los productos. Intentá nuevamente más tarde.';
  }
};

// Ejecutamos la función al cargar la página
if (productosContainer) {
  cargarProductos();
}