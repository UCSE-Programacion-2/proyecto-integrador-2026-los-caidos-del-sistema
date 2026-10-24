
const express = require('express');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// ========================================
// AUTORIZACIÓN DE ADMINISTRADORES
// ========================================

// Comprueba que el usuario autenticado
// tenga permisos de administrador.
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Acceso denegado. Se requiere rol de administrador.',
      },
    });
  }

  next();
};

// ========================================
// RUTAS PÚBLICAS
// ========================================

// Cualquier visitante puede consultar
// los productos del catálogo.
router.get('/', getProducts);
router.get('/:id', getProductById);

// ========================================
// RUTAS PROTEGIDAS
// ========================================

// Solo los administradores pueden
// crear, modificar o eliminar productos.
router.post('/', protect, requireAdmin, createProduct);
router.put('/:id', protect, requireAdmin, updateProduct);
router.delete('/:id', protect, requireAdmin, deleteProduct);

module.exports = router;
