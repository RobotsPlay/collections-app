const {model, Schema} = require('mongoose');

const collectionSchema = new Schema({
    name: String,
    createdAt: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Collection', collectionSchema);