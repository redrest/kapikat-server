const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const ApiError = require('../exceptions/ApiError');
const tokenService = require('../service/tokenService');
const UserDto = require('../dtos/userDto');
const mailService = require('../service/mailService');
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

class userService {
    async registration(email, password) {
        const person = await UserModel.findOne({email});
        if(person) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashedPassword = await bcrypt.hash(password, 5);
        const verificationCode = generateCode();
        const user = await UserModel.create({email, password: hashedPassword, verificationCode});
        await mailService.sendActivationMail(email, verificationCode);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
            message: "Код подтверждения отправлен на почту"
        }
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if(!user) {
            throw ApiError.NotFound('Пользователь не найден');
        }
        const isTruePassword = await bcrypt.compare(password, user.password);
        if(!isTruePassword) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refreshUserToken(refreshToken) {
        if (!refreshToken) {
            throw ApiError.BadRequest('Refresh токен не предоставлен');
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        if (!userData) {
            throw ApiError.Unauthorized('Некорректный или просроченный refresh токен');
        }
        const foundToken = await tokenService.findToken(refreshToken);
        if (!foundToken) {
            throw ApiError.Unauthorized('Refresh токен не найден в базе');
        }
        const user = await UserModel.findById(userData.id);
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким ID не найден');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        };
    }


    async confirmEmail(email, code) {
        const user = await UserModel.findOne({ email });
        if (!user) throw ApiError.NotFound("Пользователь не найден");

        if (user.verificationCode !== code) {
            throw ApiError.BadRequest("Неверный код");
        }

        user.isActivated = true;
        user.verificationCode = null;
        await user.save();
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
            message: "Аккаунт подтвержден"
        };
    }

    async forgotPassword(email) {
        const user = await UserModel.findOne({ email });
        if (!user) throw ApiError.NotFound("Пользователь не найден");

        const code = generateCode();
        user.verificationCode = code;
        await user.save();

        await mailService.sendVerificationCode(email, code);

        return { message: "Код подтверждения отправлен на почту" };
    }

    async resendResetPasswordCode(email) {
        const user = await UserModel.findOne({ email });
        if (!user) throw ApiError.NotFound("Пользователь не найден");

        const code = generateCode();
        user.verificationCode = code;
        await user.save();

        await mailService.sendVerificationCode(email, code);
        return { message: "Новый код для сброса пароля отправлен на почту" };
    }

    async verifyResetCode(email, code) {
        const user = await UserModel.findOne({ email });
        if (!user) throw ApiError.NotFound("Пользователь не найден");
        if (user.verificationCode !== code) {
            throw ApiError.BadRequest("Неверный код");
        }
        return { message: "Код подтвержден" };
    }

    async setNewPassword(email, newPassword) {
        const user = await UserModel.findOne({ email });
        if (!user) throw ApiError.NotFound("Пользователь не найден");

        user.password = await bcrypt.hash(newPassword, 5);
        user.verificationCode = null;
        await user.save();

        return { message: "Пароль успешно изменен" };
    }

    async verifyOldPassword(userId, oldPassword) {
        const user = await UserModel.findById(userId);
        if (!user) throw ApiError.NotFound("Пользователь не найден");

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw ApiError.BadRequest("Неверный текущий пароль");

        return { message: "Пароль подтверждён" };
    }

    async changePassword(userId, newPassword) {
        const user = await UserModel.findById(userId);
        if (!user) throw ApiError.NotFound("Пользователь не найден");

        const hashed = await bcrypt.hash(newPassword, 5);
        user.password = hashed;
        await user.save();

        return { message: "Пароль успешно изменён" };
    }

    async resendConfirmationCode(email) {
        if (!email) {
            throw ApiError.BadRequest('Email обязателен');
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest(`Пользователь с почтой ${email} не найден`);
        }
        if (user.isActivated) {
            throw ApiError.BadRequest('Аккаунт уже подтверждён');
        }

        const newCode = generateCode();
        user.verificationCode = newCode;
        await user.save();

        await mailService.sendActivationMail(email, newCode);

        return { message: 'Новый код подтверждения отправлен на почту' };
    }
}

module.exports = new userService();
