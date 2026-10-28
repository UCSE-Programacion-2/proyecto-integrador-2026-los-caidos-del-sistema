require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

// Imágenes en frontend/frontend-react/public/productos (fotos de Balbi Home, usadas con permiso)
const products = [
  {
    name: 'Juego de Platos de Cerámica',
    description: 'Set de platos de cerámica en tonos neutros, ideal para el uso diario.',
    price: 32999,
    category: 'Bazar',
    stock: 12,
    image: '/productos/platos.jpg',
  },
  {
    name: 'Set de Copas Flauta',
    description: 'Copas de vidrio tipo flauta para brindis y ocasiones especiales.',
    price: 18999,
    category: 'Bazar',
    stock: 15,
    image: '/productos/copas.jpg',
  },
  {
    name: 'Tetera de Vidrio con Infusor',
    description: 'Tetera de vidrio borosilicato con infusor para hebras.',
    price: 24500,
    category: 'Bazar',
    stock: 8,
    image: '/productos/tetera.jpg',
  },
  {
    name: 'Set de Mesa con Cubiertos',
    description: 'Platos, bowls y cubiertos con mango de madera para armar tu mesa.',
    price: 45999,
    category: 'Bazar',
    stock: 5,
    image: '/productos/mesa.jpg',
  },
  {
    name: 'Espejo Sol de Bambú',
    description: 'Espejo decorativo con marco de varillas de bambú.',
    price: 38500,
    category: 'Decoración',
    stock: 4,
    image: '/productos/espejo.jpg',
  },
  {
    name: 'Vela Aromática en Frasco',
    description: 'Vela aromática en frasco de vidrio ámbar.',
    price: 9999,
    category: 'Decoración',
    stock: 20,
    image: '/productos/vela.jpg',
  },
  {
    name: 'Letras Decorativas Home',
    description: 'Palabra Home de madera para estantes y repisas.',
    price: 12500,
    category: 'Decoración',
    stock: 10,
    image: '/productos/letras.jpg',
  },
  {
    name: 'Set de Baño con Difusor',
    description: 'Dispensers de cerámica y difusor de varillas.',
    price: 21999,
    category: 'Decoración',
    stock: 0,
    image: '/productos/difusor.jpg',
  },
  {
    name: 'Juego de Sábanas Microfibra',
    description: 'Juego de sábanas de microfibra, 2 ½ plazas.',
    price: 15999,
    category: 'Blanco',
    stock: 18,
    image: '/productos/sabanas.jpg',
  },
  {
    name: 'Cubrecama Isla con Fundas',
    description: 'Cubrecama jacquard de 2 ½ plazas con fundas de almohada.',
    price: 54999,
    category: 'Blanco',
    stock: 6,
    image: '/productos/cubrecama.jpg',
  },
  {
    name: 'Almohadón Texturado',
    description: 'Almohadón decorativo con textura en relieve.',
    price: 11999,
    category: 'Blanco',
    stock: 14,
    image: '/productos/almohadon.jpg',
  },
  {
    name: 'Pie de Cama a Rayas',
    description: 'Pie de cama tejido a rayas para dar calidez al dormitorio.',
    price: 19999,
    category: 'Blanco',
    stock: 9,
    image: '/productos/piedecama.jpg',
  },
  {
    name: 'Licuadora Peabody',
    description: 'Licuadora con jarra de vidrio y 2 velocidades más pulso.',
    price: 89999,
    category: 'Electrodomésticos',
    stock: 7,
    image: '/productos/licuadora.jpg',
  },
  {
    name: 'Tostadora Peabody 4 Panes',
    description: 'Tostadora de acero inoxidable para 4 rebanadas.',
    price: 64999,
    category: 'Electrodomésticos',
    stock: 5,
    image: '/productos/tostadora.jpg',
  },
  {
    name: 'Minipimer con Accesorios',
    description: 'Mixer de mano con batidor y picador.',
    price: 49999,
    category: 'Electrodomésticos',
    stock: 8,
    image: '/productos/minipimer.jpg',
  },
  {
    name: 'Calefactor Halógeno de Torre',
    description: 'Calefactor de torre de bajo consumo para ambientes medianos.',
    price: 74999,
    category: 'Electrodomésticos',
    stock: 3,
    image: '/productos/calefactor-torre.jpg',
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log(`${products.length} productos cargados correctamente`);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(`Error al cargar productos: ${error.message}`);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();