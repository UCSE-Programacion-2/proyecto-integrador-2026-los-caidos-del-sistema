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
// INICIAR SERVIDOR
// ======================================================

// Iniciar el servidor en el puerto correspondiente.
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});