const Router = require("express").Router;
const router = new Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const addressController = require('../controllers/addressController');

router.get('/', authMiddleware, userController.getProfile);
router.put('/', authMiddleware, userController.updateProfile);

router.post('/address', authMiddleware, addressController.addAddress);
router.put('/address/:id', authMiddleware, addressController.updateAddress);
router.delete('/address/:id', authMiddleware, addressController.deleteAddress);

router.post('/forgot-password', authMiddleware, userController.forgotPassword);
router.post('/resend-reset-code', authMiddleware, userController.resendResetPasswordCode);
router.post('/verify-code', authMiddleware, userController.verifyResetCode);
router.post('/set-new-password', authMiddleware, userController.setNewPassword);

router.post('/change-password', authMiddleware, userController.changePassword);
router.post('/verify-old-password', authMiddleware, userController.verifyOldPassword);

module.exports = router;
