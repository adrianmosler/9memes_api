import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let commentSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'publication',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('comment', commentSchema);
