const Router = require("express").Router;
const router = new Router();
const orderController = require('../controllers/orderController');
import authMiddleware from '../middlewares/authMiddleware.js';

router.post('/', authMiddleware, orderController.createOrder);
router.get('/latest', authMiddleware, orderController.getLatestOrder);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);
router.get('/', authMiddleware, orderController.getUserOrders);

module.exports = router;
