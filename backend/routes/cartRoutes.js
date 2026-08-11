const express = require('express');
const { getCart, addItemToCart, removeItemFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getCart);
router.post('/items', protect, addItemToCart);
router.delete('/items/:productId', protect, removeItemFromCart);

module.exports = router;