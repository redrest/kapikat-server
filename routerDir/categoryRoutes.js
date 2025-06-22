const Router = require("express").Router;
const router = new Router();
const categoryController = require('../controllers/categoryController');
const uploadImages = require('../middlewares/uploadImages');
import authMiddleware from '../middlewares/authMiddleware.js';
const checkRole = require('../middlewares/checkRole');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post(
    '/',
    authMiddleware,
    checkRole('ADMIN'),
    uploadImages.single('image'),
    categoryController.createCategory);
router.put(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    uploadImages.single('image'),
    categoryController.updateCategory);
router.delete(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    categoryController.deleteCategory);

module.exports = router;
