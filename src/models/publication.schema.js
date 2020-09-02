import mongoose from 'mongoose';
import usuarioSchema from './user.schema';

const Schema = mongoose.Schema;

export let publicationSchema = new Schema({
    title: { type: String, required: true },
    description: {
        type: String,
        required: true,
    },
    likes: [usuarioSchema],
    unLikes: [usuarioSchema],
    category: [categorySchema],
    img: {
        type: String,
        required: true,
    },
    createdAt: Date,
    createdBy: usuarioSchema,
});

module.exports = mongoose.model('publication', PublicationSchema);
