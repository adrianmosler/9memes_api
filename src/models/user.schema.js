import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    userName: {
        type: String,
        unique: true,
        required: [true, 'El nombre de usuario es obligatorio'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
        required: false,
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        required: false,
        default: false,
    },
});

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('User', userSchema);
