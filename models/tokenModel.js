const {Schema, model} = require('mongoose');

const TokenModel = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true},
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
    }
})

module.exports = model('Token', TokenModel);
