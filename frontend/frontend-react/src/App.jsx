import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Detalle from './pages/Detalle';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// Mapa de rutas de la SPA: todas comparten el Layout (Navbar + Footer)
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/catalogo' element={<Catalogo />} />
        <Route path='/producto/:id' element={<Detalle />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<Registro />} />
        <Route path='/carrito' element={<Carrito />} />
        <Route path='/checkout' element={<Checkout />} />

        {/* Rutas protegidas: solo usuarios con rol admin */}
        <Route element={<AdminRoute />}>
          <Route path='/admin' element={<Admin />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
