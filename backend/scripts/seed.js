require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  {
    name: 'Juego de Vajilla',
    description: 'Juego de vajilla para uso diario y reuniones familiares',
    price: 15999,
    category: 'Bazar',
    stock: 10,
    image: '',
  },
  {
    name: 'Espejo Moderno',
    description: 'Espejo decorativo de diseño moderno para distintos ambientes',
    price: 22500,
    category: 'Decoración',
    stock: 8,
    image: '',
  },
  {
    name: 'Juego de Sábanas',
    description: 'Juego de sábanas suave y cómodo para dormitorio',
    price: 18200,
    category: 'Blanco',
    stock: 15,
    image: '',
  },
  {
    name: 'Licuadora',
    description: 'Licuadora para preparar jugos, licuados y distintas recetas',
    price: 29999,
    category: 'Electrodomésticos',
    stock: 10,
    image: '',
  },
  {
    name: 'Set de Cuchillos',
    description: 'Set de cuchillos para la preparación de alimentos',
    price: 12300,
    category: 'Bazar',
    stock: 12,
    image: '',
  },
  {
    name: 'Cuadro Abstracto',
    description: 'Cuadro abstracto decorativo para living o dormitorio',
    price: 9800,
    category: 'Decoración',
    stock: 7,
    image: '',
  },
  {
    name: 'Cortinas Blackout',
    description: 'Cortinas blackout para reducir el ingreso de luz',
    price: 24000,
    category: 'Blanco',
    stock: 9,
    image: '',
  },
  {
    name: 'Tostadora',
    description: 'Tostadora compacta para desayunos y meriendas',
    price: 14500,
    category: 'Electrodomésticos',
    stock: 11,
    image: '',
  },
  {
    name: 'Sartén Antiadherente',
    description: 'Sartén antiadherente para la cocina diaria',
    price: 11800,
    category: 'Bazar',
    stock: 14,
    image: '',
  },
  {
    name: 'Lámpara Decorativa',
    description: 'Lámpara decorativa para iluminación de interiores',
    price: 17500,
    category: 'Decoración',
    stock: 6,
    image: '',
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log('10 productos cargados correctamente');

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(`Error al cargar productos: ${error.message}`);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();