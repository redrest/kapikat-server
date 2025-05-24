const orderModel = require('../models/orderModel');
const ApiError = require('../exceptions/ApiError');
const cartModel = require('../models/cartModel');

exports.createOrder = async (req, res, next) => {
    try {
        const { user, address } = req.body;
        const cart = await cartModel
            .findOne({ user: user?._id })
            .populate('items.product');
        if (!cart || !cart.items.length) {
            return next(ApiError.BadRequest("Ваша корзина пуста"));
        }

        const { city, street, house, apartment } = address;
        if (!city || !street || !house) {
            return next(ApiError.BadRequest("Необходимо указать город, улицу и дом"));
        }

        const items = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.discount
                ? Math.round(item.product.price * (1 - item.product.discount/100))
                : item.product.price
        }));
        const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

        const order = await orderModel.create({
            user: {
                _id: user?._id,
                name: user?.name,
                email: user?.email,
                phone: user?.phone
            },
            items,
            total,
            address: { city, street, house, apartment }
        });

        await cartModel.findOneAndUpdate({ user: req.user.id }, { items: [] });
        res.status(201).json(order);
    } catch (e) {
        next(e);
    }
};

exports.getUserOrders = async (req, res, next) => {
    try {
        const orders = await orderModel.find({ "user._id": req.user.id })
            .populate('items.product');

        const formatted = orders.map(order => {
            const o = order.toObject();
            return {
                ...o,
                items: o.items.map(item => ({
                    ...item,
                    product: {
                        ...item.product,
                        image: `${process.env.API_URL}/uploads/${item.product.image}`
                    }
                }))
            };
        });

        res.status(200).json(formatted);
    } catch (e) {
        next(e);
    }
};

exports.getLatestOrder = async (req, res, next) => {
    try {
        const order = await orderModel
            .findOne({ "user._id": req.user.id })
            .sort({ createdAt: -1 })
            .populate('items.product');
        if (!order) return res.status(204).end();

        const o = order.toObject();
        const formatted = {
            ...o,
            items: o.items.map(item => ({
                ...item,
                product: {
                    ...item.product,
                    image: `${process.env.API_URL}/uploads/${item.product.image}`
                }
            }))
        };

        res.json(formatted);
    } catch (e) {
        next(e);
    }
};


exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await orderModel.findOneAndUpdate(
            { _id: req.params.id, "user._id": req.user.id },
            { status: 'cancelled' },
            { new: true }
        );
        const o = order.toObject();
        const formatted = {
            ...o,
            items: o.items.map(item => ({
                ...item,
                product: {
                    ...item.product,
                    image: `${process.env.API_URL}/uploads/${item.product.image}`
                }
            }))
        };
        if (!order) return next(ApiError.NotFound("Заказ не найден"));
        res.json(formatted);
    } catch (e) {
        next(e);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await orderModel.findById(req.params._id)
            .populate('items.product');

        if (!order) {
            return next(ApiError.NotFound("Заказ не найден"));
        }

        const o = order.toObject();
        const formatted = {
            ...o,
            items: o.items.map(item => ({
                ...item,
                product: {
                    ...item.product,
                    image: `${process.env.API_URL}/uploads/${item.product.image}`
                }
            }))
        };

        res.status(200).json(formatted);
    } catch (e) {
        next(e);
    }
};
