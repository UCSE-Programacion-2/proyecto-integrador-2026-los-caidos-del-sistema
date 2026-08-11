const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'Error interno del servidor' },
    });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({
        error: { code: 'BAD_REQUEST', message: 'productId y quantity válidos son obligatorios' },
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Producto no encontrado' },
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');

    return res.status(201).json({ cart });
  } catch (error) {
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'Error interno del servidor' },
    });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Carrito no encontrado' },
      });
    }

    const itemExists = cart.items.some((item) => item.product.toString() === productId);
    if (!itemExists) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Producto no encontrado en el carrito' },
      });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');

    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'Error interno del servidor' },
    });
  }
};

module.exports = { getCart, addItemToCart, removeItemFromCart };