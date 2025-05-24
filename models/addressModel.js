const {Schema, model} = require('mongoose');

const addressSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    city: {type: String, required: true},
    street: {type: String, required: true},
    house: {type: String, required: true},
    apartment: {type: String},
});

module.exports = model("Address", addressSchema);
