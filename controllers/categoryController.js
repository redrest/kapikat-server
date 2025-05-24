const categoryModel = require('../models/categoryModel');
const ApiError = require('../exceptions/ApiError');

exports.createCategory = async (req, res, next) => {
    try {
        const { name, parent, image, filters } = req.body;

        const newCategory = new categoryModel({
            name,
            parent: parent || null,
            image: req.file ? req.file.filename : null,
            filters: filters || []
        });

        const saved = await newCategory.save();
        res.status(201).json({
            data: {
                ...saved.toObject(),
                image: saved.image ? `${process.env.API_URL}/uploads/${saved.image}` : null
            },
            message: "Категория добавлена"
        });
    } catch (e) {
        next(e);
    }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const { search } = req.query;
        if (search) {
            const regex = { $regex: search, $options: 'i' };
            const matched = await categoryModel.find({ name: regex }).lean();
            const result = matched.map(cat => ({
                _id:     cat._id,
                name:    cat.name,
                parent:  cat.parent,
                image:   cat.image
                    ? `${process.env.API_URL}/uploads/${cat.image}`
                    : null,
                subcategories: []
            }));

            return res.status(200).json({
                data:    result,
                message: 'Категории получены'
            });
        }

        const categories = await categoryModel.aggregate([
            { $match: { parent: null } },
            {
                $lookup: {
                    from:         'categories',
                    localField:   '_id',
                    foreignField: 'parent',
                    as:           'subcategories'
                }
            }
        ]);

        const categoriesObj = categories.map(cat => ({
            ...cat,
            image: cat.image
                ? `${process.env.API_URL}/uploads/${cat.image}`
                : null,
            subcategories: cat.subcategories.map(sub => ({
                ...sub,
                image: sub.image
                    ? `${process.env.API_URL}/uploads/${sub.image}`
                    : null
            }))
        }));

        return res.status(200).json({
            data:    categoriesObj,
            message: 'Категории получены'
        });

    } catch (e) {
        next(e);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryModel.findById(req.params.id);

        if (!category) {
            return next(ApiError.NotFound("Категория не найдена"));
        }

        const subcategories = await categoryModel.find({ parent: category._id });

        const formattedSubcategories = subcategories.map(subcategory => ({
            ...subcategory._doc,
            image: subcategory.image ? `${process.env.API_URL}/uploads/${subcategory.image}` : null
        }));

        res.status(200).json({
            ...category._doc,
            subcategories: formattedSubcategories,
            image: category.image ? `${process.env.API_URL}/uploads/${category.image}` : null
        });
    } catch (e) {
        next(e);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.image = req.file.filename;
        }
        const category = await categoryModel.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );
        if (!category) {
            return next(ApiError.NotFound("Категория не найдена"));
        }
        res.status(200).json({
            data: {
                ...category.toObject(),
                image: `${process.env.API_URL}/uploads/${category.image}`
            },
            message: "Категория обновлена"
        });
    } catch (e) {
        next(e);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.findByIdAndDelete(req.params.id);
        if (!category) {
            return next(ApiError.NotFound("Категория не найдена"));
        }
        res.status(200).json({ message: "Категория удалена" });
    } catch (e) {
        next(e);
    }
};


