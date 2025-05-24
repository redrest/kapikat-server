const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    user: {
        _id: {type: Schema.Types.ObjectId, ref: 'User'},
        name: {type: String},
        email: {type: String},
        phone: {type: String},
    },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    address: {
        city: {type: String, required: true},
        street: {type: String, required: true},
        house: {type: String, required: true},
        apartment: {type: String, required: true}
    },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
