const Router = require("express").Router;
const router = new Router();
const cartController = require('../controllers/cartController');
import authMiddleware from '../middlewares/authMiddleware.js';

router.get('/', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, cartController.addToCart);
router.put('/update', authMiddleware, cartController.updateCartItem);
router.delete('/remove/:productId', authMiddleware, cartController.removeFromCart);
router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;

