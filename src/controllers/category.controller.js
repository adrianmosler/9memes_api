import categorySchema from './../models/category.schema';
import mongoose from 'mongoose';
/**
 * Se obtienen todas las categorías según "filters"
 * @param {*} data, donde data.name puede usarse como un filtro
 * data.name ="^algo" busca todas las ocurencias de "algo" en name
 * data.name="algo" busca la ocurrencia completa
 */
export async function getAllCategories(data, skip, limit) {
    let categories = [];
    let filters = [];
    // quitamos datos innecesarios del string name
    let name = data.filter.name ? data.filter.name.trim().toLowerCase() : null;
    delete data.filter.name;

    if (name) {
        if (name.substr(0, 1) === '^') {
            // si contiene ^ => generamos buqueda por substring con ignoreCase
            name = RegExp(`${name.slice(1)}`, 'i');
        }
        filters.push({ name });
    }

    if (Object.keys(data.filter).length) {
        // si tiene más elementos para filtrar se concatenan
        filters = filters.concat([data.filter]);
    }

    const query = filters.length ? { $and: filters } : {};
    try {
        if (data.skip && data.limit) {
            categories = await categorySchema
                .find(query)
                .skip(skip)
                .limit(limit);
        } else {
            categories = await categorySchema.find(query);
        }
    } catch (err) {
        return { err };
    }
    return { categories };
}

/**
 * Se obtienen una las categorias que tenga id
 * @param {*} data
 */
export async function getById(id) {
    let category = null;
    try {
        let err = null;
        let status = 400;
        if (id && mongoose.isValidObjectId(id)) {
            // si tiene id y si es un id válido
            category = await categorySchema.findById(id);
            if (!category) {
                err = { menssage: 'Categoría no encontrada', id };
            } else {
                status = 200;
            }
        } else {
            err = { menssage: 'Formato ID incorrecto', id };
        }
        return { err, status, category };
    } catch (e) {
        return { err: e, status: 500, category };
    }
}
