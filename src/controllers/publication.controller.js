import mongoose from 'mongoose';
import moment from 'moment';
import publicationSchema from '../models/publication.schema';
import * as ctrCategory from '../controllers/category.controller';
import * as ctrUser from '../controllers/user.controller';
const cloudinary = require('cloudinary');

/**
 * Se obtienen todas las publicaciones que cumplan con ciertos filtros "data.filters"
 * @param {*} data
 */

// queda pendiente probar get con más likes (param moreLikes = true) y por un rango de fecha recibido
//(fechaIni / fechaFin) si no  se reciben las fechas puede asumirse las del día
// sort(-1) por fecha de creacion del meme
export async function getAllPublications(data) {
    let listPublications = [];
    let idCategory = data.filters?.idCategory;
    let filters = [];
    let title = data.filters?.title
        ? data.filters.title.trim().toLowerCase()
        : null;

    // obtenemos parámetros para publicaciones más likes o más unLikes en un periodo de fecha
    const moreDisLikes = data.filters?.moreDisLikes;
    const moreLikes = data.filters?.moreLikes === 'true';
    let dateIni = data.filters?.dateIni;
    let dateFin = data.filters?.dateIni;
    try {
        if (moreLikes || moreDisLikes) {
            // si se quieren todas las publicaciones con más likes o más unlikes
            //(dateIni) = dateIni ? new Date(dateIni):new Date();
            if (!dateIni) {
                // 1 día anterior desde hora actual
                dateIni = moment().subtract(10, 'days').toDate();
            }
            if (!dateFin) {
                // fecha y hora actual
                dateFin = moment().toDate();
            }
            const orderBy = moreLikes ? '$likes' : '$unLikes';
            const pipeline = [
                {
                    $match: {
                        $and: [
                            {
                                createdAt: {
                                    $gte: dateIni,
                                    $lte: dateFin,
                                },
                            },
                        ],
                    },
                },
                // Project with an array length 10
                {
                    $project: {
                        likes: 1,
                        unLikes: 1,
                        title: 1,
                        description: 1,
                        category: 1,
                        img: 1,
                        createdAt: 1,
                        createdBy: 1,
                        length: { $size: orderBy },
                    },
                },

                // Sort on the "length"
                { $sort: { length: -1 } },

                // Project if you really want
                {
                    $project: {
                        likes: 1,
                        unLikes: 1,
                        title: 1,
                        description: 1,
                        category: 1,
                        img: 1,
                        createdAt: 1,
                        createdBy: 1,
                        length: -1,
                    },
                },
            ];
            listPublications = await publicationSchema
                .aggregate(pipeline)
                .skip(data.skip)
                .limit(data.limit);
        } else {
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
                .sort({ createdAt: -1 })
                .skip(data.skip)
                .limit(data.limit);
        }
        return { listPublications };
    } catch (err) {
        console.log(err);
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
    const user = JSON.parse(data.body.user);
    const img = data.files?.img; // falta
    const categoryArray = JSON.parse(data.body.category);

    if (
        !data.body.title ||
        //!data.body.description ||
        !categoryArray.length ||
        !user?._id ||
        !img
    ) {
        return {
            err: { menssage: 'Faltan parámetros requeridos' },
            status: 400,
        };
    }

    // obtenemos solo las de categorías activas de la BD
    const category = await Promise.all(
        categoryArray.map(async (cat) => {
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
    //guardamos la imagen
    const validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    const nameImgCut = img.name.split('.');
    const extension = nameImgCut[nameImgCut.length - 1];
    const generalSrc = 'src/uploads/';
    const imgNameServer = new Date().getTime() + img.name;
    const imgSrcServer = generalSrc + imgNameServer;

    if (validExtensions.indexOf(extension) < 0) {
        return {
            err: {
                menssage:
                    'Extensión imagen no permitida. Los formatos habilitados son png, jpg, jpeg y gif',
                error: '',
            },
            status: 400,
        };
    }

    let responseImg;
    await img.mv(imgSrcServer);
    try {
        responseImg = await cloudinary.v2.uploader.upload(imgSrcServer);
    } catch (error) {
        return {
            err: {
                menssage: 'Error al subir imagen a servidor remoto',
                error: '',
            },
            status: 500,
        };
    }

    try {
        let publication = new publicationSchema({
            title: data.body.title,
            description: data.description,
            category,
            likes: [],
            unLikes: [],
            img: responseImg,
            createdAt: new Date(),
            createdBy: { _id: userFound._id, userName: userFound.userName },
        });

        const respSave = await publication.save();

        return { err: null, status: 200, publication: respSave };
    } catch (e) {
        return { err: e, status: 500, publication: null };
    }
}

/**
 * Solo se actualizan una publicación para editar atributos likes, unlikes
 * en publications
 * @param {*} unPublication contiene la publicación a actualizar
 */
export async function update(id, unPublication) {
    let likes = unPublication.likes;
    let unLikes = unPublication.unLikes;
    if (!id || !likes || !unLikes) {
        return {
            err: { menssage: 'Faltan parámetros requeridos' },
            status: 400,
        };
    }
    const resp = await getById(id);
    if (resp.err && !resp.publication) {
        return resp;
    } else {
        let publication = new publicationSchema(resp.publication);
        try {
            // verficamos que los usuario existan en la BD y esten activos
            likes = (await filterUser(likes)) || [];
            unLikes = (await filterUser(unLikes)) || [];

            // verificamos que el usuario no se repita en ambos array,
            // usuario repetido => se elimina de ambos
            const arrays = await clearLikes(likes, unLikes);
            publication.likes = arrays.likes;
            publication.unLikes = arrays.unLikes;
            // guardamos la publicacion actualizada
            const respPub = await publication.save();
            return { err: null, publication: respPub };
        } catch (err) {
            return { err, status: 500, publication: null };
        }
    }
}

/**
 *  filtramos usuarios de los arrays que existan y estén activos
 * @param {*} arrayUser con ids de usuarios
 */
export async function filterUser(arrayUser) {
    const userLikes = await arrayUser.filter(async (idUsr) => {
        // obtenemos el usuario de la BD
        const usrResp = await ctrUser.getById(idUsr._id);
        return (!usrResp.err && !usrResp) || !usrResp.active;
    });
    return userLikes;
}

/**
 * eliminamos usuarios repetidos en ambos arrays
 * @param {*} arrayUser
 */
export async function clearLikes(arrayLikes, arrayUnLikes) {
    if (arrayLikes?.length && arrayUnLikes?.length) {
        // recorremos el arrayUnLikes para verificar si estan en arrayLikes
        arrayUnLikes.forEach(async (idUsr, index) => {
            //obtenemos la posición del idUsr en el array de likes
            const pos = arrayLikes.findIndex(
                (idObj) => idUsr._id === idObj._id
            );
            if (pos >= 0) {
                //como el usuario está en ambos array lo borramos en los dos
                arrayLikes.splice(pos, 1);
                arrayUnLikes.splice(index, 1);
            }
        });
    }
    return { likes: arrayLikes, unLikes: arrayUnLikes };
}
