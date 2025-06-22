const Router = require("express").Router;
const router = new Router();
const authmiddleware = require('../middlewares/authmiddleware');
const userController = require('../controllers/userController');
const addressController = require('../controllers/addressController');

router.get('/', authmiddleware, userController.getProfile);
router.put('/', authmiddleware, userController.updateProfile);

router.post('/address', authmiddleware, addressController.addAddress);
router.put('/address/:id', authmiddleware, addressController.updateAddress);
router.delete('/address/:id', authmiddleware, addressController.deleteAddress);

router.post('/forgot-password', authmiddleware, userController.forgotPassword);
router.post('/resend-reset-code', authmiddleware, userController.resendResetPasswordCode);
router.post('/verify-code', authmiddleware, userController.verifyResetCode);
router.post('/set-new-password', authmiddleware, userController.setNewPassword);

router.post('/change-password', authmiddleware, userController.changePassword);
router.post('/verify-old-password', authmiddleware, userController.verifyOldPassword);

module.exports = router;
