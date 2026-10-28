import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

// Muestra su contenido con una animación cuando entra en pantalla al hacer scroll.
// Usa IntersectionObserver: el navegador avisa cuándo el elemento se hace visible.

function Revelar({ children, como: Etiqueta = 'div', className = '', id }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = ref.current;

    // Navegadores sin soporte: se muestra directamente
    if (!elemento || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observador.observe(elemento);

    return () => observador.disconnect();
  }, []);

  return (
    <Etiqueta
      ref={ref}
      id={id}
      className={['revelar', visible && 'revelar--visible', className].filter(Boolean).join(' ')}
    >
      {children}
    </Etiqueta>
  );
}

Revelar.propTypes = {
  children: PropTypes.node.isRequired,
  como: PropTypes.elementType,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Revelar;
