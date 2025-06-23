const Router = require("express").Router;
const userController = require("../controllers/userController");
const {body} = require("express-validator");
const router = new Router();

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refreshUserToken);

router.post('/forgot-password', userController.forgotPassword);
router.post('/resend-reset-code', userController.resendResetPasswordCode);
router.post('/verify-code', userController.verifyResetCode);
router.post('/set-new-password', userController.setNewPassword);

router.post('/confirm-email', userController.confirmEmail);
router.post('/resend-confirmation-code', userController.resendConfirmationCode);

module.exports = router;


