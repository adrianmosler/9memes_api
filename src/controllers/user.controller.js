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

export async function register(data) {
    const name = data.name ? data.name.trim().toUpperCase() : null;
    const userName = data.userName ? data.userName.trim().toUpperCase() : null;
    const email = data.email ? data.email.trim().toUpperCase() : null;
    // chequeamos campos requeridos
    if (!name || !userName || !email || !data.password) {
        return {
            err: 'Faltan atributos requeridos',
            status: 400,
        };
    }

    // buscamos algun usuario con el mismo userName o email
    const filters = { $or: [{ userName }, { email }] };
    const userFound = await getByAtributos(filters);
    if (userFound.err) {
        userFound.status = 500;
        return userFound;
    }
    if (userFound.user) {
        return {
            err: 'Ya existe un usuario con el mismo userName o email',
            status: 400,
        };
    }
    let user = new userSchema({
        name,
        userName,
        email,
        password: data.password,
        img: data.img || '',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    user.password = await user.encryptPassword(data.password);
    try {
        let userDB = await user.save();
        userDB.password = null; // eliminamos password para que no sea enviada
        return { err: null, status: 200, userDB };
    } catch (err) {
        return { err: 'Error al intentar insertar el usuario', status: 500 };
    }
}

/**
 * devuelve el primer usuario que coincida con la busqueda especificada en filters
 * @param {*} filters json que se usa de filtro para la consulta find()
 */
// ejemplo{} $and:[userName:'juan',]}
export async function getByAtributos(filters) {
    if (filters) {
        try {
            //se busca al menos un usuario que cumpla con "filters"
            const user = await userSchema.findOne(filters);
            return { user };
        } catch (err) {
            return { err, menssage: 'Error al intentar obtener el usuario' };
        }
    }
    return null;
}
