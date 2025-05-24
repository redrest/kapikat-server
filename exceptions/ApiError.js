module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors=[]) {
        super(message);
        this.status = status;
        this.errors = errors
    }

    static BadRequest(message, errors=[]){
        return new ApiError(400, message, errors);
    }

    static Unauthorized(message = 'Пользователь не авторизован') {
        return new ApiError(401, message);
    }

    static Forbidden(message = 'Доступ запрещён') {
        return new ApiError(403, message);
    }

    static NotFound(message = 'Не найдено') {
        return new ApiError(404, message);
    }

}
