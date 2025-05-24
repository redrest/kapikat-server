const { body } = require('express-validator');

exports.productValidationRules = [
    body('name').notEmpty().withMessage('Название обязательно'),
    body('shelfLife.value')
        .notEmpty().withMessage('Значение срока годности обязательно')
        .isInt({ min: 1 }).withMessage('Срок годности должен быть целым положительным числом'),
    body('shelfLife.unit')
        .notEmpty().withMessage('Единица срока годности обязательна')
        .isIn(['Д', 'М']).withMessage('Единица должна быть "д" (дни) или "м" (месяцы)'),
    body('storageConditions').notEmpty().withMessage('Условия хранения обязательны'),
    body('price').isFloat({ gt: 0 }).withMessage('Цена должна быть положительной'),
    body('category').isMongoId().withMessage('Неверный ID категории'),
    body('image').notEmpty().withMessage('Изображение обязательно'),
];

