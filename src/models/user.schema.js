import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

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
    active: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        required: false,
        default: false,
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

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

// ciframos password
userSchema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(Number(process.env.CANTSALT));
    return bcrypt.hash(password, salt);
};

//comparamos password
userSchema.methods.matchPassword = async function (password) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

module.exports = mongoose.model('user', userSchema);
