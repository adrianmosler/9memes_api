import mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    active: { type: Boolean, default: true },
    createdAt: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        name: String,
    },
});

module.exports = mongoose.model('category', categorySchema);
