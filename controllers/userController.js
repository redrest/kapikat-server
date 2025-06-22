const userService = require('../service/userService');
const {validationResult} = require('express-validator');
const ApiError = require("../exceptions/ApiError");
const userModel = require('../models/userModel');

class userController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 14*24*60*60*1000,
                httpOnly: true,
                sameSite: 'strict'
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 14*24*60*60*1000,
                httpOnly: true,
                sameSite: 'strict'
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }
    async refreshUserToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                return next(ApiError.BadRequest('Отсутствует refresh токен в cookies'));
            }
            const userData = await userService.refreshUserToken(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 14*24*60*60*1000,
                httpOnly: true,
                sameSite: 'strict',
            });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getProfile(req, res, next)  {
        try {
            const user = await userModel.findById(req.user.id).populate('addresses');
            if (!user) {
                return next(ApiError.NotFound("Пользователь не найден"))
            }
            res.status(200).json(user);
        } catch (e) {
            next(e);
        }
    };

    async updateProfile(req, res, next) {
        try {
            const { name, phone } = req.body;

            const user = await userModel.findByIdAndUpdate(
                req.user.id,
                { name, phone },
                { new: true }
            ).populate('addresses');

            res.status(200).json({ message: 'Профиль обновлён', user });
        } catch (e) {
            next(e);
        }
    };

    async confirmEmail(req, res, next) {
        try {
            const { email, code } = req.body;
            const response = await userService.confirmEmail(email, code);
            res.cookie('refreshToken', response.refreshToken, {
                maxAge: 14 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
            res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const response = await userService.forgotPassword(email);
            res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async resendResetPasswordCode(req, res, next) {
        try {
            const { email } = req.body;
            const result = await userService.resendResetPasswordCode(email);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async verifyResetCode(req, res, next) {
        try {
            const { email, code } = req.body;
            await userService.verifyResetCode(email, code);
            res.json({ message: 'Код подтвержден.' });
        } catch (e) {
            next(e);
        }
    }

    async setNewPassword(req, res, next) {
        try {
            const { email, newPassword } = req.body;
            await userService.setNewPassword(email, newPassword);
            res.json({ message: 'Пароль успешно изменен' });
        } catch (e) {
            next(e);
        }
    }

    async verifyOldPassword(req, res, next) {
        try {
            const { oldPassword } = req.body;
            const response = await userService.verifyOldPassword(req.user.id, oldPassword);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { newPassword } = req.body;
            const response = await userService.changePassword(req.user.id, newPassword);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async resendConfirmationCode(req, res, next) {
        try {
            const { email } = req.body;
            const result = await userService.resendConfirmationCode(email);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new userController();

