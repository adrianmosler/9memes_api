import publicationSchema from '../models/publication.schema';
import mongoose from 'mongoose';
import * as ctrCategory from '../controllers/category.controller';
import * as ctrUser from '../controllers/user.controller';

/**
 * Se obtienen todas las publicaciones que cumplan con ciertos filtros "data.filters"
 * @param {*} data
 */

// queda pendiente probar get con más likes (param moreLikes = true) y por un rango de fecha recibido
//(fechaIni / fechaFin) si no  se reciben las fechas puede asumirse las del día
// sort(-1) por fecha de creacion del meme
// ver si se cambian de estado? (active)
export async function getAllPublications(data) {
    let listPublications = [];
    let idCategory = data.filters?.idCategory;
    let filters = [];
    let title = data.filters?.title
        ? data.filters.title.trim().toLowerCase()
        : null;

    try {
        if (title) {
            if (title.substr(0, 1) === '^') {
                // si contiene ^ => generamos buqueda por substring con ignoreCase
                title = RegExp(`${title.slice(1)}`, 'i');
            }
            filters.push({ title });
            delete data.filters.title;
        }

        if (idCategory) {
            if (idCategory && mongoose.isValidObjectId(idCategory)) {
                // si tiene id y si es un id válido
                filters.push({ 'category._id': idCategory });
            }
            delete data.filters.idCategory;
        }

        // quedan pendientes todas las publicaciones con más likes
        if (data.filters.likes) {
        }

        //ver si se cambian de estado?
        // filters.push({ active: true });

        if (Object.keys(data.filters).length) {
            // si tiene más elementos para filtrar se concatenan
            filters = filters.concat([data.filters]);
        }

        // generamos la query para el find
        const query = !filters.length
            ? {}
            : filters.length > 1
            ? { $and: filters }
            : filters[0];

        listPublications = await publicationSchema
            .find(query)
            .skip(data.skip)
            .limit(data.limit);

        return { listPublications };
    } catch (err) {
        return { err, status: 500, listPublications };
    }
}

/**
 * Se obtienen la publicación que tenga id
 * @param {*} data
 */
export async function getById(id) {
    let publication = null;
    try {
        let err = null;
        let status = 400;
        if (id && mongoose.isValidObjectId(id)) {
            // si tiene id y si es un id válido
            publication = await publicationSchema.findById(id);
            if (!publication) {
                err = { menssage: 'Objeto no encontrado', id };
            } else {
                status = 200;
            }
        } else {
            err = { menssage: 'Formato ID incorrecto', id };
        }
        return { err, status, publication };
    } catch (e) {
        return { err: e, status: 500, publication };
    }
}

/**
 *
 * @param {} data recibe los datos de la publicacion al guardar
 */
export async function save(data) {
    let user = data.user;
    const img = data.img; // falta

    if (
        !data.title ||
        !data.description ||
        !data.category?.length ||
        !user?._id
    ) {
        return {
            err: { menssage: 'Faltan parámetros requeridos' },
            status: 400,
        };
    }

    // obtenemos solo las de categorías activas de la BD
    const category = await Promise.all(
        data.category.map(async (cat) => {
            let resp = await ctrCategory.getById(cat._id);
            if (!resp.err && resp.category?.active) {
                return {
                    _id: resp.category._id,
                    name: resp.category.name,
                    description: resp.category.description,
                };
            }
        })
    );

    if (!category.length) {
        return { err: { menssage: 'Category no encontrada' }, status: 400 };
    }

    // obtenemos el usuario de la BD
    const usrResp = await ctrUser.getById(user._id);
    const userFound = usrResp.user;
    if ((usrResp.err && !userFound) || !userFound.active) {
        return {
            err: { menssage: 'Usuario no encontrado', error: usrResp.err },
            status: 400,
        };
    }
    try {
        let publication = new publicationSchema({
            title: data.title,
            description: data.description,
            category,
            likes: [],
            unLikes: [],
            img,
            createdAt: new Date(),
            createdBy: { _id: userFound._id, userName: userFound.userName },
        });

        const respSave = await publication.save();

        return { err: null, status: 200, publication: respSave };
    } catch (e) {
        return { err: e, status: 500, publication: null };
    }
}
