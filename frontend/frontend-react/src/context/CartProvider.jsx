import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { CartContext } from './cartContext';

// Misma clave utilizada en el carrito del Sprint 3
const CART_STORAGE_KEY = 'balbi_cart';

// Recuperar el carrito guardado al iniciar la aplicación
function obtenerCarritoGuardado() {
  try {
    const datos = localStorage.getItem(CART_STORAGE_KEY);

    if (!datos) {
      return [];
    }

    const carrito = JSON.parse(datos);

    if (!Array.isArray(carrito)) {
      throw new Error('El formato del carrito no es válido.');
    }

    return carrito;
  } catch (error) {
    console.error('Error al recuperar el carrito:', error);
    return [];
  }
}

// Stock máximo de un ítem (los guardados antes de este cambio no lo tienen: sin límite)
function stockMaximo(item) {
  const stock = Number(item.stock);
  return Number.isFinite(stock) ? stock : Infinity;
}

// Provee el estado global del carrito a toda la aplicación
function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(obtenerCarritoGuardado);
  const [errorCarrito, setErrorCarrito] = useState('');

  // Guardar automáticamente los cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
      setErrorCarrito('');
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
      setErrorCarrito('No pudimos guardar los cambios del carrito. Intentá nuevamente.');
    }
  }, [carrito]);

  // Agregar un producto o aumentar su cantidad si ya existe
  const agregarAlCarrito = useCallback(producto => {
    if (!producto || !(producto._id || producto.id)) {
      return;
    }

    const productoId = String(producto._id || producto.id);
    const precio = Number(producto.price);

    if (!Number.isFinite(precio) || precio < 0) {
      return;
    }

    setCarrito(carritoActual => {
      const productoExistente = carritoActual.find(item => String(item.id) === productoId);

      if (productoExistente) {
        // No superar el stock disponible
        return carritoActual.map(item =>
          String(item.id) === productoId
            ? {
                ...item,
                stock: producto.stock,
                quantity: Math.min(item.quantity + 1, stockMaximo({ stock: producto.stock })),
              }
            : item,
        );
      }

      return [
        ...carritoActual,
        {
          id: productoId,
          name: producto.name,
          price: precio,
          category: producto.category,
          image: producto.image,
          stock: producto.stock,
          quantity: 1,
        },
      ];
    });
  }, []);

  // Aumentar o disminuir la cantidad de un producto
  const cambiarCantidad = useCallback((productoId, cambio) => {
    if (!Number.isInteger(cambio) || cambio === 0) {
      return;
    }

    setCarrito(carritoActual =>
      carritoActual.map(item => {
        if (String(item.id) !== String(productoId)) {
          return item;
        }

        const nuevaCantidad = item.quantity + cambio;

        // No permitir cantidades menores a 1 ni mayores al stock disponible
        if (nuevaCantidad < 1 || nuevaCantidad > stockMaximo(item)) {
          return item;
        }

        return { ...item, quantity: nuevaCantidad };
      }),
    );
  }, []);

  // Eliminar un producto del carrito
  const eliminarDelCarrito = useCallback(productoId => {
    setCarrito(carritoActual =>
      carritoActual.filter(item => String(item.id) !== String(productoId)),
    );
  }, []);

  // Vaciar el carrito después de confirmar la compra simulada
  const vaciarCarrito = useCallback(() => {
    setCarrito([]);
  }, []);

  // Calcular la cantidad total de unidades
  const cantidadTotal = useMemo(
    () => carrito.reduce((acumulado, producto) => acumulado + producto.quantity, 0),
    [carrito],
  );

  // Calcular el subtotal de todos los productos
  const subtotal = useMemo(
    () =>
      carrito.reduce((acumulado, producto) => acumulado + producto.price * producto.quantity, 0),
    [carrito],
  );

  // El envío es gratuito, como en el Sprint 3
  const envio = 0;
  const total = subtotal + envio;

  // Compartir los datos y las funciones del carrito
  const valor = useMemo(
    () => ({
      carrito,
      agregarAlCarrito,
      cambiarCantidad,
      eliminarDelCarrito,
      vaciarCarrito,
      cantidadTotal,
      subtotal,
      envio,
      total,
      errorCarrito,
    }),
    [
      carrito,
      agregarAlCarrito,
      cambiarCantidad,
      eliminarDelCarrito,
      vaciarCarrito,
      cantidadTotal,
      subtotal,
      total,
      errorCarrito,
    ],
  );

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
