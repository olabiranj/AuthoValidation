const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StuffSchema = new Schema({
    name: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Stuff', StuffSchema);