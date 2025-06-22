const Router = require("express").Router;
const router = new Router();
const orderController = require('../controllers/orderController');
const authmiddleware = require('../middlewares/authmiddleware');

router.post('/', authmiddleware, orderController.createOrder);
router.get('/latest', authmiddleware, orderController.getLatestOrder);
router.get('/:id', authmiddleware, orderController.getOrderById);
router.put('/:id/cancel', authmiddleware, orderController.cancelOrder);
router.get('/', authmiddleware, orderController.getUserOrders);

module.exports = router;
