const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let OrderSchema = new Schema({
    price: Number,
    quantity: Number,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);