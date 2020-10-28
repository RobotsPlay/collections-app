const {model, Schema} = require('mongoose');

const collectionSchema = new Schema({
    name: String,
    username: String,
    createdAt: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Collection', collectionSchema);