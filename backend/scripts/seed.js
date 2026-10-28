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
  {
    name: 'Tetera de Hierro Fundido',
    description: 'Tetera de hierro esmaltado blanco con asa dorada.',
    price: 36999,
    category: 'Bazar',
    stock: 6,
    image: '/productos/tetera-hierro.jpg',
  },
  {
    name: 'Cacerola de Cobre Hudson',
    description: 'Cacerola antiadherente color cobre con tapa de vidrio.',
    price: 42999,
    category: 'Bazar',
    stock: 7,
    image: '/productos/cacerola-cobre.jpg',
  },
  {
    name: 'Set Botellón y Vasos Tallados',
    description: 'Botellón de vidrio tallado con vasos y bandeja dorada.',
    price: 29999,
    category: 'Bazar',
    stock: 5,
    image: '/productos/set-botellon.jpg',
  },
  {
    name: 'Taza Perfect Imperfections',
    description: 'Taza de cerámica blanca con frase y corazones.',
    price: 6999,
    category: 'Bazar',
    stock: 25,
    image: '/productos/taza-perfect.jpg',
  },
  {
    name: 'Tazas con Plato Ancla',
    description: 'Juego de tazas de cerámica con plato y diseño náutico.',
    price: 17999,
    category: 'Bazar',
    stock: 10,
    image: '/productos/tazas-ancla.jpg',
  },
  {
    name: 'Termo Peabody Rojo',
    description: 'Termo de acero inoxidable con pico cebador, 1 litro.',
    price: 39999,
    category: 'Bazar',
    stock: 9,
    image: '/productos/termo-rojo.jpg',
  },
  {
    name: 'Bandeja Dorada con Bombonera',
    description: 'Bandeja de metal dorado con bombonera y florero de vidrio.',
    price: 24999,
    category: 'Decoración',
    stock: 6,
    image: '/productos/alhajero.jpg',
  },
  {
    name: 'Espejo Redondo de Ratán Negro',
    description: 'Espejo decorativo con marco de ratán tejido en negro.',
    price: 45999,
    category: 'Decoración',
    stock: 3,
    image: '/productos/espejo-negro.jpg',
  },
  {
    name: 'Reloj de Pared Clásico',
    description: 'Reloj de pared con marco plateado y números grandes.',
    price: 14999,
    category: 'Decoración',
    stock: 12,
    image: '/productos/reloj.jpg',
  },
  {
    name: 'Reloj de Arena con Glitter',
    description: 'Reloj de arena de vidrio con brillos dorados.',
    price: 8999,
    category: 'Decoración',
    stock: 15,
    image: '/productos/relojes-arena.jpg',
  },
  {
    name: 'Vela Decorativa Arco',
    description: 'Vela de cera con forma de arco en tono crema.',
    price: 7499,
    category: 'Decoración',
    stock: 20,
    image: '/productos/vela-arco.jpg',
  },
  {
    name: 'Maceta Texturada con Planta',
    description: 'Maceta de cerámica blanca con planta artificial.',
    price: 13999,
    category: 'Decoración',
    stock: 0,
    image: '/productos/macetas.jpg',
  },
  {
    name: 'Acolchado Isla Estampado',
    description: 'Acolchado reversible estampado de 2 ½ plazas.',
    price: 59999,
    category: 'Blanco',
    stock: 5,
    image: '/productos/acolchado.jpg',
  },
  {
    name: 'Almohadones Botánicos',
    description: 'Almohadones con estampa de hojas, 45 x 45 cm.',
    price: 9999,
    category: 'Blanco',
    stock: 16,
    image: '/productos/almohadones.jpg',
  },
  {
    name: 'Set de Almohadas y Ropa de Cama',
    description: 'Almohadas y ropa de cama blanca para el dormitorio.',
    price: 48999,
    category: 'Blanco',
    stock: 4,
    image: '/productos/ropa-cama.jpg',
  },
  {
    name: 'Toallones de Colores',
    description: 'Toallones de algodón en colores lisos.',
    price: 13499,
    category: 'Blanco',
    stock: 20,
    image: '/productos/toallas-flores.jpg',
  },
  {
    name: 'Toallas Rosa con Dispenser',
    description: 'Juego de toallas rosa con dispenser de vidrio para el baño.',
    price: 22999,
    category: 'Blanco',
    stock: 8,
    image: '/productos/toallas-rosas.jpg',
  },
  {
    name: 'Toallón Super Absorbente',
    description: 'Toallón de algodón 100 % blanco, súper absorbente.',
    price: 16999,
    category: 'Blanco',
    stock: 14,
    image: '/productos/toallones.jpg',
  },
  {
    name: 'Exprimidor Eléctrico Peabody',
    description: 'Exprimidor de acero inoxidable con brazo de presión.',
    price: 54999,
    category: 'Electrodomésticos',
    stock: 6,
    image: '/productos/exprimidor.jpg',
  },
  {
    name: 'Freidora Eléctrica sin Aceite',
    description: 'Freidora de aire Peabody con control de temperatura.',
    price: 94999,
    category: 'Electrodomésticos',
    stock: 5,
    image: '/productos/freidora.jpg',
  },
  {
    name: 'Horno Eléctrico BGH 35 L',
    description: 'Horno eléctrico de 35 litros con anafes.',
    price: 159999,
    category: 'Electrodomésticos',
    stock: 3,
    image: '/productos/horno-electrico.jpg',
  },
  {
    name: 'Licuadora Personal Atma',
    description: 'Licuadora personal Essential Fit con vaso para llevar.',
    price: 39999,
    category: 'Electrodomésticos',
    stock: 9,
    image: '/productos/licuadora-personal.jpg',
  },
  {
    name: 'Espumador de Leche Peabody',
    description: 'Espumador eléctrico para cafés y chocolatadas.',
    price: 44999,
    category: 'Electrodomésticos',
    stock: 7,
    image: '/productos/espumador.jpg',
  },
  {
    name: 'Parrilla Grill Eléctrica Atma',
    description: 'Grill eléctrico con placas antiadherentes.',
    price: 69999,
    category: 'Electrodomésticos',
    stock: 4,
    image: '/productos/parrilla-grill.jpg',
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
