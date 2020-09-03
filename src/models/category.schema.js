import mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    createdAt: Date,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        name: String,
    },
});

module.exports = mongoose.model('category', categorySchema);
