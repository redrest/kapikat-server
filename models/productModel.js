const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    composition: {type: String},
    shelfLife: {
        value: { type: Number, required: true },
        unit: {
            type: String,
            enum: ['д', 'м'],
            required: true
        }
    },
    weight: {
        value: { type: Number, required: true },
        unit: {
            type: String,
            enum: ['г', 'кг', 'шт', 'мл', 'л'],
            required: true
        }
    },
    storageConditions: {type: String, required: true},
    price: {type: Number, required: true},
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true},
    manufacturer: {type: String},
    discount: {type: Number},
    image: {type: String, required: true},
    filters: { type: [String], default: [] }
})

module.exports = model('Product', productSchema);
