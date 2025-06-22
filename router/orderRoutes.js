const Router = require("express").Router;
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/latest', authMiddleware, orderController.getLatestOrder);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);
router.get('/', authMiddleware, orderController.getUserOrders);

module.exports = router;
