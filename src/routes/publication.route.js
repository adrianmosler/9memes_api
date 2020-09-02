import * as express from 'express';

const router = express.Router();

const limitDefault = 10;

router.get('/', async function (req, res) {
    const skip = req.query?.skip || 0;
    const limit = req.query?.limit || limitDefault;
    const filter = req.query.filter || {};
    const listPublications = await getAllPublications({ filter, skip, limit });
    res.json(listPublications);
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
