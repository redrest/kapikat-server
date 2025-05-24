const addressModel = require('../models/addressModel');
const userModel = require('../models/userModel');
const ApiError = require('../exceptions/ApiError');

exports.addAddress = async (req, res, next) => {
    try {
        const { city, street, house, apartment } = req.body;

        const address = new addressModel({
            user: req.user.id,
            city,
            street,
            house,
            apartment
        });

        await address.save();

        await userModel.findByIdAndUpdate(req.user.id, {
            $push: { addresses: address._id }
        });

        res.status(201).json({ message: 'Адрес добавлен', address });
    } catch (e) {
        next(e);
    }
};

exports.updateAddress = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { city, street, house, apartment } = req.body;

        const address = await addressModel.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { city, street, house, apartment },
            { new: true }
        );

        if (!address) {
            return next(ApiError.NotFound("Адрес не найден"));
        }

        res.status(200).json({ message: 'Адрес обновлён', address });
    } catch (e) {
        next(e);
    }
};

exports.deleteAddress = async (req, res, next) => {
    try {
        const { id } = req.params;

        const address = await addressModel.findOneAndDelete({ _id: id, user: req.user.id });
        if (!address) {
            return next(ApiError.NotFound("Адрес не найден"));
        }
        await userModel.findByIdAndUpdate(req.user.id, {
            $pull: { addresses: id }
        });

        res.status(200).json({ message: 'Адрес удалён' });
    } catch (e) {
        next(e);
    }
};
