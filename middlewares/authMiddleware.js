const ApiError = require('../exceptions/ApiError');
const tokenService = require('../service/tokenService');

module.exports = function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.Unauthorized());
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.Unauthorized());
        }
        const userData =  tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.Unauthorized());
        }

        req.user = userData;
        next();

    } catch (e) {
        return next(ApiError.Unauthorized());
    }
}
