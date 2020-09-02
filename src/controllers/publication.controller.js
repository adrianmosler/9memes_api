import * as publication from '../models/publication.schema';
/**
 * Se obtienen todas las publicaciones que cumplan con ciiertos filtros "filters"
 * @param {*} filters
 */
export async function getAllPublications(datos) {
    let query = { $and: [datos.filter] };
    const listPublication = publication
        .find(query)
        .skip(datos.skip)
        .limit(datos.limit);
    return listPublication;
}
