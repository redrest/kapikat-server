const Router = require("express").Router;
const UserController = require("../controllers/UserController");
const {body} = require("express-validator");
const router = new Router();

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 32}),
    UserController.registration
);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/refresh', UserController.refreshUserToken);

router.post('/forgot-password', UserController.forgotPassword);
router.post('/resend-reset-code', UserController.resendResetPasswordCode);
router.post('/verify-code', UserController.verifyResetCode);
router.post('/set-new-password', UserController.setNewPassword);

router.post('/confirm-email', UserController.confirmEmail);
router.post('/resend-confirmation-code', UserController.resendConfirmationCode);
module.exports = router;


