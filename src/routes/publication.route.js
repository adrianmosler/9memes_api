import * as express from 'express';
import * as ctrPublication from '../controllers/publication.controller';
const router = express.Router();

const limitDefault = 10;

router.get('/', async function (req, res) {
    const skip = req.query.skip || 0;
    let limit = req.query.limit || limitDefault;
    const filter = req.query.title;
    const result = await ctrPublication.getAllPublications({
        filter,
        skip,
        limit,
    });
    if (result.err) {
        res.status(500).send(result.err);
    } else {
        res.send(result.listPublication).status(200);
    }
});

router.get('/:id', async function (req, res) {
    const id = req.params.id;
    res.json({});
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
