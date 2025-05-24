const productModel = require('../models/productModel');
const ApiError = require('../exceptions/ApiError');
const {validationResult} = require('express-validator');
const categoryModel = require('../models/categoryModel');

exports.createProduct = async (req, res, next) => {
    try {
        const {
            name,
            description,
            composition,
            shelfLife,
            weight,
            storageConditions,
            price,
            category: categoryId,
            manufacturer,
            discount,
            filters
        } = req.body;

        const categoryDoc = await categoryModel.findById(categoryId);
        if (!categoryDoc) {
            return next(ApiError.NotFound(`Категория с ID "${categoryId}" не найдена`));
        }

        const newProduct = new productModel({
            name,
            description,
            composition,
            shelfLife,
            weight,
            storageConditions,
            price,
            category: categoryDoc._id,
            manufacturer,
            discount,
            image: req.file ? req.file.filename : null,
            filters: filters || [],
        });

        await newProduct.save();

        res.status(201).json({
            data: {
                ...newProduct.toObject(),
                image: `${process.env.API_URL}/uploads/${newProduct.image}`
            },
            message: 'Товар успешно создан'
        });

    } catch (e) {
        next(e);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 20, category, filters } = req.query;
        const query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        if (filters) {
            const filtersArray = Array.isArray(filters) ? filters : [filters];
            query.filters = { $regex: filtersArray.join("|"), $options: 'i' };
        }

        const total = await productModel.countDocuments(query);
        const products = await productModel
            .find(query)
            .populate('category')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const productsObj = products.map(product => ({
            ...product.toObject(),
            image: `${process.env.API_URL}/uploads/${product.image}`
        }));

        res.status(200).json({
            total,
            page: Number(page),
            limit: Number(limit),
            data: {productsObj},
            message: "Товары получены"
        })
    } catch (e) {
        next(e);
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id).populate('category');
        if (!product) {
            return next(ApiError.NotFound("Товар не найден"));
        }
        res.status(200).json({
            data: {
                ...product.toObject(),
                image: `${process.env.API_URL}/uploads/${product.image}`
            },
            message: "Товар получен"
        });
    } catch(e) {
        next(e);
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const updates = { ...req.body };

        if (req.file) {
            updates.image = req.file.filename;
        } else {
            delete updates.image;
        }

        if (updates.category) {
            const categoryDoc = await categoryModel.findById(updates.category);
            if (!categoryDoc) {
                return next(ApiError.NotFound(`Категория с ID "${updates.category}" не найдена`));
            }
            updates.category = categoryDoc._id;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(productId, updates, { new: true });

        if (!updatedProduct) {
            return next(ApiError.NotFound('Товар не найден'));
        }

        res.status(200).json({
            message: 'Товар обновлён',
            data: {
                ...updatedProduct.toObject(),
                image: `${process.env.API_URL}/uploads/${updatedProduct.image}`
            }
        });
    } catch (e) {
        next(e);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id);
        if (!product) {
            return next(ApiError.NotFound("Товар не найден"));
        }
        res.status(200).json({
            message: "Товар удален"
        });
    } catch (e) {
        next(e);
    }
}
