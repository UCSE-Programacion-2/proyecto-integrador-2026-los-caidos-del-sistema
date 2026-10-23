
// Clave utilizada para guardar el carrito
const CART_STORAGE_KEY = 'balbi_cart';

// Mostrar un mensaje comprensible cuando ocurre un error
const mostrarErrorCarrito = (mensaje) => {
  console.error(mensaje);

  const tablaCarrito = document.getElementById('carrito-productos');

  if (tablaCarrito) {
    let aviso = document.getElementById('carrito-error');

    if (!aviso) {
      aviso = document.createElement('p');
      aviso.id = 'carrito-error';
      aviso.setAttribute('role', 'alert');
      aviso.style.color = '#c93324';
      aviso.style.fontWeight = '600';
      aviso.style.padding = '12px';

      const tabla = tablaCarrito.closest('table');

      if (tabla) {
        tabla.before(aviso);
      } else {
        tablaCarrito.before(aviso);
      }
    }

    aviso.textContent = mensaje;
  } else {
    // En el detalle del producto, informar mediante un aviso
    alert(mensaje);
  }
};

// Obtener los productos guardados en el carrito
const obtenerCarrito = () => {
  try {
    const carritoGuardado = localStorage.getItem(CART_STORAGE_KEY);

    const carrito = carritoGuardado
      ? JSON.parse(carritoGuardado)
      : [];

    if (!Array.isArray(carrito)) {
      throw new Error('El formato del carrito no es válido');
    }

    return carrito;
  } catch (error) {
    console.error('Error al recuperar el carrito:', error);

    mostrarErrorCarrito(
      'No pudimos recuperar tu carrito. Intentá recargar la página.'
    );

    // null permite distinguir un error de un carrito vacío
    return null;
  }
};

// Guardar los productos del carrito
const guardarCarrito = (carrito) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
    return true;
  } catch (error) {
    console.error('Error al guardar el carrito:', error);

    mostrarErrorCarrito(
      'No pudimos guardar los cambios del carrito. Intentá nuevamente.'
    );

    return false;
  }
};

// Agregar un producto al carrito
const agregarAlCarrito = (producto) => {
  const carrito = obtenerCarrito();

  // No modificar el carrito si falló la lectura
  if (carrito === null) {
    return false;
  }

  // Buscar si el producto ya existe
  const productoExistente = carrito.find(
    (item) => item.id === producto._id
  );

  if (productoExistente) {
    productoExistente.quantity += 1;
  } else {
    carrito.push({
      id: producto._id,
      name: producto.name,
      price: Number(producto.price),
      category: producto.category,
      image: producto.image,
      quantity: 1
    });
  }

  // Informar si el guardado fue exitoso
  return guardarCarrito(carrito);
};

// Aumentar o disminuir la cantidad de un producto
const cambiarCantidad = (productoId, cambio) => {
  const carrito = obtenerCarrito();

  if (carrito === null) {
    return;
  }

  const producto = carrito.find(
    (item) => item.id === productoId
  );

  if (!producto) {
    return;
  }

  const nuevaCantidad = producto.quantity + cambio;

  // No permitir cantidades menores a 1
  if (nuevaCantidad < 1) {
    return;
  }

  producto.quantity = nuevaCantidad;

  // Actualizar la pantalla solamente si se pudo guardar
  if (guardarCarrito(carrito)) {
    mostrarCarrito();
  }
};

// Eliminar un producto del carrito
const eliminarDelCarrito = (productoId) => {
  const carrito = obtenerCarrito();

  if (carrito === null) {
    return;
  }

  const carritoActualizado = carrito.filter(
    (item) => item.id !== productoId
  );

  // Actualizar la pantalla solamente si se pudo guardar
  if (guardarCarrito(carritoActualizado)) {
    mostrarCarrito();
  }
};

// Mostrar los productos guardados en el carrito
const mostrarCarrito = () => {
  const tablaCarrito = document.getElementById('carrito-productos');

  // No ejecutar esta función fuera de carrito.html
  if (!tablaCarrito) {
    return;
  }

  const carrito = obtenerCarrito();

  // Si falló la lectura, no mostrar datos incorrectos
  if (carrito === null) {
    tablaCarrito.innerHTML = '';

    const filaError = document.createElement('tr');
    const celdaError = document.createElement('td');

    celdaError.colSpan = 4;
    celdaError.textContent =
      'No se pudieron cargar los productos del carrito.';
    celdaError.style.textAlign = 'center';
    celdaError.style.padding = '24px';

    filaError.appendChild(celdaError);
    tablaCarrito.appendChild(filaError);

    const botonFinalizar = document.querySelector(
      '.carrito__resumen a[href="checkout.html"]'
    );

    if (botonFinalizar) {
      botonFinalizar.style.opacity = '0.5';
      botonFinalizar.style.cursor = 'not-allowed';
      botonFinalizar.title =
        'No se pudo recuperar el carrito';

      botonFinalizar.onclick = (evento) => {
        evento.preventDefault();
      };
    }

    return;
  }

  // Eliminar un aviso anterior si ya se recuperó correctamente
  const avisoAnterior = document.getElementById('carrito-error');

  if (avisoAnterior) {
    avisoAnterior.remove();
  }

  // Limpiar la tabla
  tablaCarrito.innerHTML = '';

  let total = 0;

  // Mostrar mensaje cuando el carrito esté vacío
  if (carrito.length === 0) {
    const filaVacia = document.createElement('tr');
    const celdaVacia = document.createElement('td');

    celdaVacia.colSpan = 4;
    celdaVacia.textContent =
      'Tu carrito está vacío. ¡Explorá nuestro catálogo!';
    celdaVacia.style.textAlign = 'center';
    celdaVacia.style.padding = '24px';

    filaVacia.appendChild(celdaVacia);
    tablaCarrito.appendChild(filaVacia);
  }

  // Mostrar los productos seleccionados
  carrito.forEach((producto) => {
    const fila = document.createElement('tr');

    const subtotal = producto.price * producto.quantity;
    total += subtotal;

    fila.innerHTML = `
      <td>
        <div class="carrito__producto">
          <span class="carrito__producto-img">📦</span>
          <div>
            <h3></h3>
            <p></p>
          </div>
        </div>
      </td>

      <td>
        <div class="carrito__cantidad">
          <button
            type="button"
            class="carrito__cantidad-btn"
            data-accion="disminuir"
            aria-label="Disminuir cantidad"
          >−</button>

          <span>${producto.quantity}</span>

          <button
            type="button"
            class="carrito__cantidad-btn"
            data-accion="aumentar"
            aria-label="Aumentar cantidad"
          >+</button>
        </div>
      </td>

      <td>$${producto.price.toLocaleString('es-AR')}</td>

      <td>
        <div class="carrito__subtotal-producto">
          <span>$${subtotal.toLocaleString('es-AR')}</span>

          <button
            type="button"
            class="carrito__eliminar-btn"
            data-accion="eliminar"
            aria-label="Eliminar producto"
            title="Eliminar producto"
          >🗑️</button>
        </div>
      </td>
    `;

    // Mostrar nombre y categoría de forma segura
    fila.querySelector('h3').textContent = producto.name;
    fila.querySelector('p').textContent =
      producto.category || 'Sin categoría';

    // Disminuir cantidad
    fila.querySelector('[data-accion="disminuir"]')
      .addEventListener('click', () => {
        cambiarCantidad(producto.id, -1);
      });

    // Aumentar cantidad
    fila.querySelector('[data-accion="aumentar"]')
      .addEventListener('click', () => {
        cambiarCantidad(producto.id, 1);
      });

    // Eliminar producto
    fila.querySelector('[data-accion="eliminar"]')
      .addEventListener('click', () => {
        eliminarDelCarrito(producto.id);
      });

    tablaCarrito.appendChild(fila);
  });

  // Actualizar el resumen de compra
  const subtotalElemento = document.getElementById('carrito-subtotal');
  const totalElemento = document.getElementById('carrito-total');

  if (subtotalElemento) {
    subtotalElemento.textContent =
      `$${total.toLocaleString('es-AR')}`;
  }

  if (totalElemento) {
    totalElemento.textContent =
      `$${total.toLocaleString('es-AR')}`;
  }

  // Controlar el botón Finalizar compra
  const botonFinalizar = document.querySelector(
    '.carrito__resumen a[href="checkout.html"]'
  );

  if (botonFinalizar) {
    const carritoVacio = carrito.length === 0;

    botonFinalizar.style.opacity =
      carritoVacio ? '0.5' : '1';

    botonFinalizar.style.cursor =
      carritoVacio ? 'not-allowed' : 'pointer';

    botonFinalizar.title = carritoVacio
      ? 'Agregá productos al carrito para continuar'
      : '';

    botonFinalizar.onclick = (evento) => {
      if (carritoVacio) {
        evento.preventDefault();
      }
    };
  }
};

// Mostrar el carrito al cargar la página
mostrarCarrito();
