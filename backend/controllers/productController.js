const Product = require('../models/Product');


const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);

    return res.status(200).json({
      products,
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al obtener los productos',
      },
    });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Producto no encontrado',
        },
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: 'ID de producto inválido',
      },
    });
  }
};


const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({
        error: {
          code: 'BAD_REQUEST',
          message: 'Todos los campos obligatorios deben ser completados',
        },
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
    });

    return res.status(201).json({
      product,
    });
  } catch (error) {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: error.message,
      },
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Producto no encontrado',
        },
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: error.message,
      },
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Producto no encontrado',
        },
      });
    }

    return res.status(200).json({
      message: 'Producto eliminado correctamente',
    });
  } catch (error) {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: 'ID de producto inválido',
      },
    });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};