import * as express from 'express';
import * as ctrPublication from '../controllers/publication.controller';
const router = express.Router();

const limitDefault = 5;

router.get('/', async function (req, res) {
    let skip = 0;
    let limit = limitDefault;

    if (req.query.skip) {
        skip = Number(req.query.skip);
        delete req.query.skip;
    }
    if (req.query.limit) {
        limit = Number(req.query.limit);
        delete req.query.limit;
    }
    const result = await ctrPublication.getAllPublications({
        filters: req.query,
        skip,
        limit,
    });
    if (result.err) {
        if (result.status === 500) {
            res.status(500).send({
                message: 'Error al realizar la consulta',
                error: result.err,
            });
        } else {
            res.status(result.status).send(result.err);
        }
    } else {
        res.send(result.listPublications).status(200);
    }
});

router.get('/:id', async function (req, res) {
    const result = await ctrPublication.getById(req.params.id);
    if (result.err) {
        if (result.status === 500) {
            res.status(500).send({
                message: 'Error en Base de Datos',
                error: result.err,
            });
        } else {
            res.status(result.status).send(result.err);
        }
    } else {
        res.send(result.publication).status(result.status);
    }
});

router.post('/', async function (req, res) {
    const publication = req.body.publication;
    res.json({});
});

router.put('/:id', async function (req, res) {
    const id = req.params.id;
    res.json({});
});

export const publicationRoutes = router;
