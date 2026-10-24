
/* ========================================
   CHECKOUT — BALBI HOME
   Resumen dinámico y compra simulada
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "balbi_cart";

  // Elementos del resumen
  const contenedorProductos = document.getElementById("checkout-productos");
  const subtotalElemento = document.getElementById("checkout-subtotal");
  const envioElemento = document.getElementById("checkout-envio");
  const totalElemento = document.getElementById("checkout-total");

  // Elementos del formulario
  const botonConfirmar = document.getElementById("confirmar-pedido");

  // Elementos del modal
  const modal = document.getElementById("checkout-modal");
  const modalIcono = document.getElementById("checkout-modal-icono");
  const modalTitulo = document.getElementById("checkout-modal-titulo");
  const modalMensaje = document.getElementById("checkout-modal-mensaje");
  const modalBoton = document.getElementById("checkout-modal-boton");

  let accionAlCerrar = null;

  // Formatear precios en pesos argentinos
  function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(valor);
  }

  // Leer el carrito desde localStorage
  function obtenerCarrito() {
    try {
      const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(datos) ? datos : [];
    } catch (error) {
      console.error("Error al leer el carrito:", error);
      return [];
    }
  }

  // Mostrar el resumen del pedido
  function mostrarResumen() {
    if (
      !contenedorProductos ||
      !subtotalElemento ||
      !envioElemento ||
      !totalElemento
    ) {
      console.error("Faltan elementos del resumen del checkout.");
      return;
    }

    const carrito = obtenerCarrito();
    contenedorProductos.innerHTML = "";

    let subtotal = 0;

    if (carrito.length === 0) {
      const mensaje = document.createElement("p");
      mensaje.textContent = "Tu carrito está vacío.";
      contenedorProductos.appendChild(mensaje);
    }

    carrito.forEach((producto) => {
      const cantidad = Number(producto.quantity) || 0;
      const precio = Number(producto.price) || 0;
      const subtotalProducto = cantidad * precio;

      subtotal += subtotalProducto;

      const item = document.createElement("div");
      item.className = "resumen__item";

      const informacion = document.createElement("div");

      const nombre = document.createElement("h3");
      nombre.textContent = producto.name;

      const textoCantidad = document.createElement("p");
      textoCantidad.textContent = `Cantidad: ${cantidad}`;

      const precioElemento = document.createElement("span");
      precioElemento.textContent = formatearPrecio(subtotalProducto);

      informacion.appendChild(nombre);
      informacion.appendChild(textoCantidad);

      item.appendChild(informacion);
      item.appendChild(precioElemento);

      contenedorProductos.appendChild(item);
    });

    // Mismo criterio de envío que el carrito
    const envio = 0;

    subtotalElemento.textContent = formatearPrecio(subtotal);
    envioElemento.textContent = "Gratis";
    totalElemento.textContent = formatearPrecio(subtotal + envio);
  }

  // Mostrar mensajes personalizados
  function mostrarModal(tipo, titulo, mensaje, textoBoton = "Aceptar", accion = null) {
    if (!modal || !modalIcono || !modalTitulo || !modalMensaje || !modalBoton) {
      console.error("Faltan elementos del modal.");
      return;
    }

    modalIcono.textContent = tipo === "exito" ? "✓" : "!";
    modalTitulo.textContent = titulo;
    modalMensaje.textContent = mensaje;
    modalBoton.textContent = textoBoton;

    accionAlCerrar = accion;
    modal.hidden = false;
    modalBoton.focus();
  }

  // Cerrar el modal
  function cerrarModal() {
    if (!modal || modal.hidden) return;

    modal.hidden = true;

    const accion = accionAlCerrar;
    accionAlCerrar = null;

    if (typeof accion === "function") {
      accion();
    } else if (botonConfirmar) {
      botonConfirmar.focus();
    }
  }

  if (modalBoton) {
    modalBoton.addEventListener("click", cerrarModal);
  }

  // Evitar que el foco salga del modal con Tab
  if (modal) {
    modal.addEventListener("keydown", (evento) => {
      if (modal.hidden) return;

      if (evento.key === "Tab") {
        evento.preventDefault();
        modalBoton.focus();
      }

      if (evento.key === "Escape") {
        evento.preventDefault();
        cerrarModal();
      }
    });
  }

  // Confirmar compra simulada
  if (botonConfirmar) {
    botonConfirmar.addEventListener("click", () => {
      const carrito = obtenerCarrito();

      // Verificar que haya productos
      if (carrito.length === 0) {
        mostrarModal(
          "aviso",
          "Tu carrito está vacío",
          "Agregá productos al carrito antes de confirmar tu pedido.",
          "Entendido"
        );
        return;
      }

      // Obtener los datos del formulario
      const nombre = document.getElementById("nombre").value.trim();
      const apellido = document.getElementById("apellido").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const direccion = document.getElementById("direccion").value.trim();
      const ciudad = document.getElementById("ciudad").value.trim();
      const pago = document.getElementById("pago");

      // Validar campos obligatorios
      if (
        !nombre ||
        !apellido ||
        !email ||
        !telefono ||
        !direccion ||
        !ciudad ||
        pago.selectedIndex === 0
      ) {
        mostrarModal(
          "aviso",
          "Faltan datos",
          "Completá todos los campos del formulario y seleccioná un método de pago.",
          "Entendido"
        );
        return;
      }

      // Validar formato del correo
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(email)) {
        mostrarModal(
          "aviso",
          "Correo electrónico inválido",
          "Ingresá una dirección de correo electrónico válida.",
          "Entendido"
        );
        return;
      }

      // Mostrar confirmación de compra simulada
      mostrarModal(
        "exito",
        "¡Pedido confirmado!",
        `¡Gracias por tu compra, ${nombre}!\n\n` +
          "Tu pedido fue confirmado en esta demostración.\n" +
          "No se realizó ningún pago ni se registró una compra real.",
        "Continuar comprando",
        () => {
          // Vaciar el carrito únicamente tras la confirmación
          localStorage.removeItem(STORAGE_KEY);

          // Redirigir al catálogo
          window.location.href = "catalogo.html";
        }
      );
    });
  }
  mostrarResumen();
});
