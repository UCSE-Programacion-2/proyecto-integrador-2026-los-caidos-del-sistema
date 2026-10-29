import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../context/cartContext';
import { formatearPrecio } from '../utils/formato';

import '../styles/checkout.css';

// Valores iniciales del formulario
const datosIniciales = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: 'San Salvador de Jujuy',
  pago: '',
};

function Checkout() {
  const navigate = useNavigate();

  const { carrito, subtotal, envio, total, vaciarCarrito, errorCarrito } = useCart();

  const [datos, setDatos] = useState(datosIniciales);
  const [modal, setModal] = useState(null);

  const botonModalRef = useRef(null);

  // Actualizar los datos del formulario
  const actualizarCampo = evento => {
    const { name, value } = evento.target;

    setDatos(datosActuales => ({
      ...datosActuales,
      [name]: value,
    }));
  };

  // Mostrar mensajes de aviso o confirmación
  const mostrarModal = (tipo, titulo, mensaje, textoBoton = 'Aceptar') => {
    setModal({
      tipo,
      titulo,
      mensaje,
      textoBoton,
    });
  };

  // Llevar el foco al botón cuando se abre el modal
  useEffect(() => {
    if (modal) {
      botonModalRef.current?.focus();
    }
  }, [modal]);

  // Cerrar el modal
  const cerrarModal = useCallback(() => {
    if (!modal) {
      return;
    }

    const compraConfirmada = modal.tipo === 'exito';

    setModal(null);

    if (compraConfirmada) {
      // Navegar al catálogo sin recargar toda la aplicación
      navigate('/catalogo', { replace: true });
    }
  }, [modal, navigate]);

  // Teclado mientras el modal está abierto: Escape lo cierra y Tab deja el foco en el botón
  useEffect(() => {
    if (!modal) {
      return undefined;
    }

    const manejarTeclado = evento => {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        cerrarModal();
      }

      if (evento.key === 'Tab') {
        evento.preventDefault();
        botonModalRef.current?.focus();
      }
    };

    document.addEventListener('keydown', manejarTeclado);

    return () => document.removeEventListener('keydown', manejarTeclado);
  }, [modal, cerrarModal]);

  // Confirmar compra simulada
  const confirmarPedido = evento => {
    evento.preventDefault();

    // No permitir confirmar un pedido con el carrito vacío
    if (carrito.length === 0) {
      mostrarModal(
        'aviso',
        'Tu carrito está vacío',
        'Agregá productos al carrito antes de confirmar tu pedido.',
        'Entendido',
      );
      return;
    }

    // No continuar si hubo un problema al guardar el carrito
    if (errorCarrito) {
      mostrarModal(
        'aviso',
        'Error en el carrito',
        'No pudimos guardar correctamente tu carrito. Intentá nuevamente.',
        'Entendido',
      );
      return;
    }

    const nombre = datos.nombre.trim();
    const apellido = datos.apellido.trim();
    const email = datos.email.trim();
    const telefono = datos.telefono.trim();
    const direccion = datos.direccion.trim();
    const ciudad = datos.ciudad.trim();

    // Validar campos obligatorios
    if (!nombre || !apellido || !email || !telefono || !direccion || !ciudad || !datos.pago) {
      mostrarModal(
        'aviso',
        'Faltan datos',
        'Completá todos los campos del formulario y seleccioná un método de pago.',
        'Entendido',
      );
      return;
    }

    // Validar el teléfono: solo números, espacios, guiones, paréntesis o +, con al menos 7 dígitos
    const telefonoValido =
      /^[\d\s()+-]+$/.test(telefono) && telefono.replace(/\D/g, '').length >= 7;

    if (!telefonoValido) {
      mostrarModal(
        'aviso',
        'Teléfono inválido',
        'Ingresá un teléfono con al menos 7 números (ej. 388 412 3456).',
        'Entendido',
      );
      return;
    }

    // Validar el formato del correo electrónico
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      mostrarModal(
        'aviso',
        'Correo electrónico inválido',
        'Ingresá una dirección de correo electrónico válida.',
        'Entendido',
      );
      return;
    }

    // Vaciar el carrito apenas se confirma la compra simulada,
    // así no queda lleno si el usuario sale sin cerrar el modal
    vaciarCarrito();

    // Mostrar confirmación de compra simulada
    mostrarModal(
      'exito',
      '¡Pedido confirmado!',
      `¡Gracias por tu compra, ${nombre}!\n\n` +
        'Tu pedido fue confirmado en esta demostración.\n' +
        'No se realizó ningún pago ni se registró una compra real.',
      'Continuar comprando',
    );
  };

  return (
    <section className='pagina checkout'>
      <section className='checkout__header'>
        <h1>Finalizar compra</h1>
        <p>Completá tus datos para confirmar el pedido</p>
      </section>

      {errorCarrito && (
        <p className='checkout__error' role='alert'>
          {errorCarrito}
        </p>
      )}

      <section className='checkout__container'>
        <form className='checkout__form' onSubmit={confirmarPedido} noValidate>
          <h2>Datos de envío</h2>

          <div className='form__grid'>
            <div className='form__group'>
              <label htmlFor='nombre'>Nombre</label>
              <input
                type='text'
                id='nombre'
                name='nombre'
                placeholder='Ingresá tu nombre'
                value={datos.nombre}
                onChange={actualizarCampo}
              />
            </div>

            <div className='form__group'>
              <label htmlFor='apellido'>Apellido</label>
              <input
                type='text'
                id='apellido'
                name='apellido'
                placeholder='Ingresá tu apellido'
                value={datos.apellido}
                onChange={actualizarCampo}
              />
            </div>

            <div className='form__group'>
              <label htmlFor='email'>Correo electrónico</label>
              <input
                type='email'
                id='email'
                name='email'
                placeholder='ejemplo@email.com'
                value={datos.email}
                onChange={actualizarCampo}
              />
            </div>

            <div className='form__group'>
              <label htmlFor='telefono'>Teléfono</label>
              <input
                type='tel'
                id='telefono'
                name='telefono'
                placeholder='388 000 0000'
                value={datos.telefono}
                onChange={actualizarCampo}
              />
            </div>

            <div className='form__group form__group--full'>
              <label htmlFor='direccion'>Dirección</label>
              <input
                type='text'
                id='direccion'
                name='direccion'
                placeholder='Calle, número, barrio'
                value={datos.direccion}
                onChange={actualizarCampo}
              />
            </div>

            <div className='form__group'>
              <label htmlFor='ciudad'>Ciudad</label>
              <input
                type='text'
                id='ciudad'
                name='ciudad'
                value={datos.ciudad}
                onChange={actualizarCampo}
              />
            </div>

            <div className='form__group'>
              <label htmlFor='pago'>Método de pago</label>
              <select id='pago' name='pago' value={datos.pago} onChange={actualizarCampo}>
                <option value=''>Seleccionar método</option>
                <option value='efectivo'>Efectivo al retirar</option>
                <option value='transferencia'>Transferencia bancaria</option>
                <option value='tarjeta'>Tarjeta de débito/crédito</option>
              </select>
            </div>
          </div>

          <div className='form__actions'>
            <Link to='/carrito' className='btn btn--outline'>
              Volver al carrito
            </Link>

            <button type='submit' className='btn btn--primary'>
              Confirmar pedido
            </button>
          </div>
        </form>

        <aside className='checkout__resumen'>
          <h2>Resumen del pedido</h2>

          <div className='checkout__productos'>
            {carrito.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              carrito.map(producto => (
                <div className='resumen__item' key={producto.id}>
                  <div>
                    <h3>{producto.name}</h3>
                    <p>Cantidad: {producto.quantity}</p>
                  </div>

                  <span>{formatearPrecio(producto.price * producto.quantity)}</span>
                </div>
              ))
            )}
          </div>

          <div className='resumen__linea'>
            <span>Subtotal</span>
            <strong>{formatearPrecio(subtotal)}</strong>
          </div>

          <div className='resumen__linea'>
            <span>Envío</span>
            <strong>{envio === 0 ? 'Gratis' : formatearPrecio(envio)}</strong>
          </div>

          <div className='resumen__total'>
            <span>Total</span>
            <strong>{formatearPrecio(total)}</strong>
          </div>
        </aside>
      </section>

      {/* Modal de mensajes del checkout */}
      {modal && (
        <div
          className='checkout-modal'
          role='dialog'
          aria-modal='true'
          aria-labelledby='checkout-modal-titulo'
          aria-describedby='checkout-modal-mensaje'
        >
          <div className='checkout-modal__contenido'>
            <div className='checkout-modal__icono' aria-hidden='true'>
              {modal.tipo === 'exito' ? '✓' : '!'}
            </div>

            <h2 className='checkout-modal__titulo' id='checkout-modal-titulo'>
              {modal.titulo}
            </h2>

            <p className='checkout-modal__mensaje' id='checkout-modal-mensaje'>
              {modal.mensaje}
            </p>

            <button
              ref={botonModalRef}
              type='button'
              className='checkout-modal__boton'
              onClick={cerrarModal}
            >
              {modal.textoBoton}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Checkout;
