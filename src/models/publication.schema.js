import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export let publicationSchema = new Schema({
    title: { type: String, required: true },
    description: {
        type: String,
        required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'usuario', required: false }],
    unLikes: [{ type: Schema.Types.ObjectId, ref: 'usuario', required: false }],
    // "category" queda embebida en el esquema "publication" con los datos necesarios
    category: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'category',
                require: false,
            },
            name: { type: String, required: false },
            description: String,
        },
    ],

    img: {
        type: String,
        required: false,
    },
    createdAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: 'usuario' },
});

module.exports = mongoose.model('publication', publicationSchema);
