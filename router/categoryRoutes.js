const Router = require("express").Router;
const router = new Router();
const categoryController = require('../controllers/categoryController');
const uploadImages = require('../middlewares/uploadImages');
const authmiddleware = require('../middlewares/authmiddleware');
const checkRole = require('../middlewares/checkRole');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post(
    '/',
    authmiddleware,
    checkRole('ADMIN'),
    uploadImages.single('image'),
    categoryController.createCategory);
router.put(
    '/:id',
    authmiddleware,
    checkRole('ADMIN'),
    uploadImages.single('image'),
    categoryController.updateCategory);
router.delete(
    '/:id',
    authmiddleware,
    checkRole('ADMIN'),
    categoryController.deleteCategory);

module.exports = router;
