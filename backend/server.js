require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

const PORT = process.env.PORT || 4000;

// Conectar con MongoDB Atlas
connectDB();

// Middlewares
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});