import categorySchema from '../models/category.schema';

/**
 * Se obtienen todas las categorías según "filters"
 * @param {*} data, donde data.name puede usarse como un filtro
 * data.name ="^algo" busca todas las ocurencias de "algo" en name
 * data.name="algo" busca la ocurrencia completa
 */
export async function getAllCategories(data, skip, limit) {
    let categories = [];
    let filters = [];
    // quitamos datos innecesarios del string
    let name = data.filter.name.trim().toLowerCase();
    delete data.filter.name;

    if (name) {
        if (name.search('^') === 0) {
            // si contiene ^ => generamos buqueda por substring con ignoreCase
            name = RegExp(`${name.slice(1)}`, 'i');
        }
        filters.push({ name });
    }

    if (Object.keys(data.filter).length) {
        // si tiene más elementos para filtrar se concatenan
        filters = filters.concat([data.filter]);
    }

    const query = filters ? { $and: filters } : {};
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
