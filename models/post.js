const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let PostSchema = new Schema({
    pFile: String,
    pUser: String,
    pContent: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);