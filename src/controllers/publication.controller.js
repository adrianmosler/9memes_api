import publicationSchema from '../models/publication.schema';

/**
 * Se obtienen todas las publicaciones que cumplan con ciiertos filtros "data.filters"
 * @param {*} data
 */
export async function getAllPublications(data) {
    let listPublication = [];
    let query = data.filter ? { $and: [{ title: data.filter }] } : {};
    try {
        listPublication = await publicationSchema
            .find(query)
            .skip(data.skip)
            .limit(data.limit);
    } catch (err) {
        return { err };
    }
    return { listPublication };
}
