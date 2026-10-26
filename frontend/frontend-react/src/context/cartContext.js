import { createContext, useContext } from 'react';

// Contexto global del carrito de compras
export const CartContext = createContext(null);

// Hook para acceder al carrito desde cualquier componente
export function useCart() {
  return useContext(CartContext);
}