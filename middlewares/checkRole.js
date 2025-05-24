const ApiError = require('../exceptions/ApiError');

module.exports = function(requiredRole) {
    return function(req, res, next) {
        if (!req.user) {
            return next(ApiError.Unauthorized());
        }

        if (req.user.role !== requiredRole) {
            return next(ApiError.Forbidden(`Требуется роль: ${requiredRole}`));
        }

        next();
    };
};
