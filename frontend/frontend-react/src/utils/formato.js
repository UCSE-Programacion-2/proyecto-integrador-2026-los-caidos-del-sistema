// Formatea un precio en pesos argentinos, igual en toda la tienda: $ 32.999
// Si el precio tiene centavos se muestran (ej. $ 1.999,50); si no, se omiten.
export function formatearPrecio(valor) {
  const numero = Number(valor);
  const tieneCentavos = !Number.isInteger(numero);

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: tieneCentavos ? 2 : 0,
    maximumFractionDigits: tieneCentavos ? 2 : 0,
  }).format(numero);
}
