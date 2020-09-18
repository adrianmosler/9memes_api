import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export let publicationSchema = new Schema({
    title: { type: String, required: true },
    description: {
        type: String,
        required: false, //TODO regresar a true
    },
    likes: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'usuario',
                required: false,
            },
        },
    ],
    unLikes: [{ type: Schema.Types.ObjectId, ref: 'usuario', required: false }],
    // "category" queda embebida en el esquema "publication" con los datos necesarios
    category: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'category',
                require: false,
            },
            name: { type: String, required: true },
            description: String,
        },
    ],

    img: {
        type: mongoose.Mixed ,
        required: false,
    },
    createdAt: Date,
    createdBy: {
        _id: { type: Schema.Types.ObjectId, ref: 'user' },
        userName: { type: String, required: false }, //TODO regresar a true
    },
});

module.exports = mongoose.model('publication', publicationSchema);
