const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    name: {type: String},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    phone: {type: String},
    addresses: [{type: Schema.Types.ObjectId, ref: 'Address'}],
    isActivated: {type: Boolean, default: false},
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
})

module.exports = model("User", UserSchema);
