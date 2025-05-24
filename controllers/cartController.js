const cartModel = require('../models/cartModel');
const ApiError = require('../exceptions/ApiError');
const productModel = require("../models/productModel");

exports.getCart = async (req, res, next) => {
    try {
        let cart = await cartModel
            .findOne({ user: req.user.id })
            .populate('items.product');

        if (!cart) {
            cart = await cartModel.create({ user: req.user.id, items: [] });
            cart = await cartModel.findById(cart._id).populate('items.product');
        }

        const cartObj = {
            ...cart.toObject(),
            items: cart.items.map(item => ({
                ...item.toObject(),
                product: {
                    ...item.product.toObject(),
                    image: `${process.env.API_URL}/uploads/${item.product.image}`,
                },
            })),
        };

        res.status(200).json(cartObj);
    } catch (e) {
        next(e);
    }
};


exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await cartModel.findOne({ user: req.user.id });
        if (!cart) {
            cart = new cartModel({ user: req.user.id, items: [] });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            throw ApiError.BadRequest('Товар не найден');
        }

        const discountedPrice = Math.round(
            product.price * (1 - ((product.discount || 0) / 100))
        );

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.finalPrice = discountedPrice;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                finalPrice: discountedPrice
            });
        }

        await cart.save();
        const updatedCart = await cartModel.findById(cart._id).populate('items.product');
        res.status(200).json(updatedCart);
    } catch (e) {
        next(e);
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await cartModel.findOne({ user: req.user.id });

        const item = cart.items.find(item => item.product.toString() === productId);
        if (item) {
            item.quantity = quantity;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (e) {
        next(e);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const cart = await cartModel.findOne({ user: req.user.id });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json(cart);
    } catch (e) {
        next(e);
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        await cartModel.findOneAndUpdate({ user: req.user.id }, { items: [] });
        res.status(200).json({ message: 'Корзина очищена' });
    } catch (e) {
        next(e);
    }
};
