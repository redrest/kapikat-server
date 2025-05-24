const Router = require("express").Router;
const productController = require('../controllers/productController');
const {productValidationRules} = require("../validators/productValidator");
const router = new Router();
const uploadImages = require('../middlewares/uploadImages');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.post(
    '/',
    authMiddleware,
    checkRole('ADMIN'),
    uploadImages.single('image'),
    productValidationRules,
    productController.createProduct
);
router.put(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    uploadImages.single('image'),
    productValidationRules,
    productController.updateProduct
);
router.delete(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    productController.deleteProduct);

module.exports = router;
