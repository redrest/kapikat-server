const {Schema, model} = require('mongoose');

const categorySchema = new Schema({
    name: {type: String, unique: true, required: true},
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    image: {type: String},
    filters: { type: [String], default: [] }
});

module.exports = model("Category", categorySchema);
