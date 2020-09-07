import publicationSchema from '../models/publication.schema';
import mongoose from 'mongoose';

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
 * Se obtienen una las publicación que tenga id
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
