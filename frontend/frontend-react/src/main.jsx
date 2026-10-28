import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import AuthProvider from './context/AuthProvider';
import CartProvider from './context/CartProvider';

import './styles/index.css';
import './styles/components.css';

// Punto de entrada: el router, la sesión y el carrito envuelven a toda la app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* future: adopta ya el comportamiento de React Router v7 (evita los avisos en consola) */}
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
