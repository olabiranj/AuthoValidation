const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let ApiSchema = new Schema({
    name: String,
    email: String,
    order: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Order'
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Api', ApiSchema);