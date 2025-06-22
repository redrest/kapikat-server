const Router = require("express").Router;
const router = new Router();
const cartController = require('../controllers/cartController');
const authmiddleware = require('../middlewares/authmiddleware');

router.get('/', authmiddleware, cartController.getCart);
router.post('/add', authmiddleware, cartController.addToCart);
router.put('/update', authmiddleware, cartController.updateCartItem);
router.delete('/remove/:productId', authmiddleware, cartController.removeFromCart);
router.delete('/clear', authmiddleware, cartController.clearCart);

module.exports = router;

