// Cargar las variables de entorno del archivo .env
require('dotenv').config();

// Importar dependencias
const express = require('express');
const cors = require('cors');

// Importar conexión a la base de datos
const connectDB = require('./config/db');

// Importar rutas del backend
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');

// Crear aplicación Express
const app = express();

// Render proporciona el puerto mediante una variable de entorno.
// En desarrollo local, utilizamos el puerto 4000.
const PORT = process.env.PORT || 4000;

// ======================================================
// CONEXIÓN CON MONGODB ATLAS
// ======================================================

// Conectar el backend con MongoDB Atlas.
connectDB();

// ======================================================
// CONFIGURACIÓN DE CORS
// ======================================================

// Direcciones desde las cuales permitimos solicitudes al backend.
//
// localhost:5173 y localhost:5174 se utilizan durante
// el desarrollo local con React y Vite.
//
// FRONTEND_URL será la dirección pública de Vercel.
// Lucas nos proporcionará esa URL cuando publique React.
const origenesPermitidos = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean);

// Configurar CORS para permitir únicamente los orígenes autorizados.
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin encabezado Origin.
      // Por ejemplo, pruebas directas de la API o herramientas como Postman.
      if (!origin || origenesPermitidos.includes(origin)) {
        return callback(null, true);
      }

      // Rechazar solicitudes provenientes de otros orígenes.
      return callback(new Error('Origen no permitido por CORS'));
    },
  }),
);

// Permitir que Express reciba datos en formato JSON.
app.use(express.json());

// ======================================================
// RUTAS DE LA API
// ======================================================

// Ruta principal para comprobar que el servidor responde.
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Rutas de autenticación.
app.use('/api/auth', authRoutes);

// Rutas del carrito.
app.use('/api/cart', cartRoutes);

// Rutas de productos.
app.use('/api/products', productRoutes);

// ======================================================
// RUTAS INEXISTENTES Y ERRORES
// ======================================================

// Cualquier ruta de la API que no exista responde 404 en JSON.
app.use('/api', (req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Ruta no encontrada' },
  });
});

// Manejador final de errores: siempre responde JSON (nunca la página HTML de Express).
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error.message === 'Origen no permitido por CORS') {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: error.message },
    });
  }

  // JSON mal escrito en el cuerpo del pedido
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: { code: 'BAD_REQUEST', message: 'El cuerpo del pedido no es un JSON válido' },
    });
  }

  console.error(error);
  return res.status(500).json({
    error: { code: 'SERVER_ERROR', message: 'Error interno del servidor' },
  });
});

// ======================================================
// INICIAR SERVIDOR
// ======================================================

// Iniciar el servidor en el puerto correspondiente.
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
