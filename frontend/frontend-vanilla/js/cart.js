
// Clave que utilizaremos para guardar el carrito
const CART_STORAGE_KEY = 'balbi_cart';

// Obtener los productos guardados en el carrito
const obtenerCarrito = () => {
  try {
    const carritoGuardado = localStorage.getItem(CART_STORAGE_KEY);

    const carrito = carritoGuardado
      ? JSON.parse(carritoGuardado)
      : [];

    return Array.isArray(carrito) ? carrito : [];
  } catch (error) {
    console.error('Error al recuperar el carrito:', error);
    return [];
  }
};

// Guardar los productos del carrito
const guardarCarrito = (carrito) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
};

// Agregar un producto al carrito
const agregarAlCarrito = (producto) => {
  const carrito = obtenerCarrito();

  // Buscar si el producto ya existe
  const productoExistente = carrito.find(
    (item) => item.id === producto._id
  );

  if (productoExistente) {
    // Si ya existe, aumentar su cantidad
    productoExistente.quantity += 1;
  } else {
    // Si no existe, agregarlo con cantidad 1
    carrito.push({
      id: producto._id,
      name: producto.name,
      price: Number(producto.price),
      category: producto.category,
      image: producto.image,
      quantity: 1
    });
  }

  guardarCarrito(carrito);
};

// Aumentar o disminuir la cantidad de un producto
const cambiarCantidad = (productoId, cambio) => {
  const carrito = obtenerCarrito();

  // Buscar el producto seleccionado
  const producto = carrito.find(
    (item) => item.id === productoId
  );

  if (!producto) {
    return;
  }

  // Calcular la nueva cantidad
  const nuevaCantidad = producto.quantity + cambio;

  // No permitir cantidades menores a 1
  if (nuevaCantidad < 1) {
    return;
  }

  // Actualizar la cantidad
  producto.quantity = nuevaCantidad;

  // Guardar los cambios
  guardarCarrito(carrito);

  // Volver a mostrar el carrito actualizado
  mostrarCarrito();
};

// Eliminar un producto del carrito
const eliminarDelCarrito = (productoId) => {
  const carrito = obtenerCarrito();

  // Conservar todos los productos excepto el seleccionado
  const carritoActualizado = carrito.filter(
    (item) => item.id !== productoId
  );

  // Guardar el carrito sin ese producto
  guardarCarrito(carritoActualizado);

  // Actualizar la tabla y el resumen
  mostrarCarrito();
};

// Mostrar los productos guardados en el carrito
const mostrarCarrito = () => {
  const tablaCarrito = document.getElementById('carrito-productos');

  // Si no estamos en la página del carrito, no hacer nada
  if (!tablaCarrito) {
    return;
  }

  const carrito = obtenerCarrito();

  // Limpiar la tabla antes de dibujarla nuevamente
  tablaCarrito.innerHTML = '';

  // Acumular el total de la compra
  let total = 0;

  // Mostrar un mensaje cuando el carrito esté vacío
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

  // Recorrer los productos del carrito
  carrito.forEach((producto) => {
    const fila = document.createElement('tr');

    // Calcular el subtotal del producto
    const subtotal = producto.price * producto.quantity;

    // Sumar al total general
    total += subtotal;

    // Crear la fila con botones de cantidad y eliminación
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

    // Botón para disminuir la cantidad
    fila.querySelector('[data-accion="disminuir"]')
      .addEventListener('click', () => {
        cambiarCantidad(producto.id, -1);
      });

    // Botón para aumentar la cantidad
    fila.querySelector('[data-accion="aumentar"]')
      .addEventListener('click', () => {
        cambiarCantidad(producto.id, 1);
      });

    // Botón para eliminar el producto
    fila.querySelector('[data-accion="eliminar"]')
      .addEventListener('click', () => {
        eliminarDelCarrito(producto.id);
      });

    // Agregar la fila a la tabla
    tablaCarrito.appendChild(fila);
  });

  // Buscar los elementos del resumen de compra
  const subtotalElemento = document.getElementById('carrito-subtotal');
  const totalElemento = document.getElementById('carrito-total');

  // Mostrar los importes actualizados
  if (subtotalElemento) {
    subtotalElemento.textContent =
      `$${total.toLocaleString('es-AR')}`;
  }

  if (totalElemento) {
    totalElemento.textContent =
      `$${total.toLocaleString('es-AR')}`;
  }

  // Controlar el botón de finalizar compra
  const botonFinalizar = document.querySelector(
    '.carrito__resumen a[href="checkout.html"]'
  );

  if (botonFinalizar) {
    const carritoVacio = carrito.length === 0;

    // Cambiar su apariencia según haya productos o no
    botonFinalizar.style.opacity = carritoVacio ? '0.5' : '1';
    botonFinalizar.style.cursor =
      carritoVacio ? 'not-allowed' : 'pointer';

    // Informar al usuario por qué no puede continuar
    botonFinalizar.title = carritoVacio
      ? 'Agregá productos al carrito para continuar'
      : '';

    // Evitar navegar al checkout cuando el carrito esté vacío
    botonFinalizar.onclick = (evento) => {
      if (carritoVacio) {
        evento.preventDefault();
      }
    };
  }
};

// Mostrar el carrito al cargar la página
mostrarCarrito();
