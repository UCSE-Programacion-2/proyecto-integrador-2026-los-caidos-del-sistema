// URL de la API de productos
const API_PRODUCT_DETAIL_URL = 'http://localhost:4000/api/products';

// Obtener el ID del producto desde la URL
const parametros = new URLSearchParams(window.location.search);
const productoId = parametros.get('id');

// Obtener los elementos del HTML
const productoImagen = document.getElementById('producto-imagen');
const productoCategoria = document.getElementById('producto-categoria');
const productoNombre = document.getElementById('producto-nombre');
const productoDescripcion = document.getElementById('producto-descripcion');
const productoPrecio = document.getElementById('producto-precio');

// Función para cargar el detalle del producto
const cargarDetalleProducto = async () => {
  try {
    // Verificar que exista un ID
    if (!productoId) {
      throw new Error('No se especificó un producto');
    }

    // Consultar el producto al backend
    const respuesta = await fetch(
      `${API_PRODUCT_DETAIL_URL}/${encodeURIComponent(productoId)}`
    );

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener el producto');
    }

    // Convertir la respuesta a JSON
    const data = await respuesta.json();
    const producto = data.product;

    if (!producto) {
      throw new Error('El producto no existe');
    }

    // Mostrar los datos del producto
    productoCategoria.textContent = producto.category || 'Sin categoría';
    productoNombre.textContent = producto.name;
    productoDescripcion.textContent =
      producto.description || 'Sin descripción disponible';

    productoPrecio.textContent =
      `$${Number(producto.price).toLocaleString('es-AR')}`;

    // Mostrar imagen
    productoImagen.innerHTML = '';

    if (producto.image) {
      const imagen = document.createElement('img');
      imagen.src = producto.image;
      imagen.alt = producto.name;
      productoImagen.appendChild(imagen);
    } else {
      productoImagen.textContent = '📦';
    }

  } catch (error) {
    console.error('Error al cargar el producto:', error);

    productoNombre.textContent = 'No se pudo cargar el producto';
    productoCategoria.textContent = '';
    productoDescripcion.textContent =
      'Verificá que el producto exista e intentá nuevamente.';
    productoPrecio.textContent = '';
    productoImagen.textContent = '📦';

    // Ocultar el botón de agregar al carrito si hay un error
    const botonCarrito = document.querySelector(
      '.detalle__acciones .btn--primary'
    );

    if (botonCarrito) {
      botonCarrito.style.display = 'none';
    }
  }
};

// Ejecutar la función al abrir la página
cargarDetalleProducto();