import userSchema from './../models/user.schema';
import mongoose from 'mongoose';

/**
 * Se obtienen el usuario tenga id
 * @param {*} data
 */
export async function getById(id) {
    let user = null;
    try {
        let err = null;
        let status = 400;
        if (id && mongoose.isValidObjectId(id)) {
            // si tiene id y si es un id válido
            user = await userSchema.findById(id);
            if (!user) {
                err = { menssage: 'Objeto no encontrado', id };
            } else {
                status = 200;
            }
        } else {
            err = { menssage: 'Formato ID incorrecto', id };
        }
        return { err, status, user };
    } catch (e) {
        return { err: e, status: 500, user };
    }
}
