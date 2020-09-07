import * as express from 'express';
import * as ctrCategory from '../controllers/category.controller';
const router = express.Router();

const limitDefault = 10;

router.get('/', async function (req, res) {
    let skip = 0;
    let limit = limitDefault;
    if (req.query.skip) {
        skip = Number(req.query.skip);
        delete req.query.skip;
    }
    if (req.query.limit) {
        limit = req.query.limit;
        delete req.query.limit;
    }

    const result = await ctrCategory.getAllCategories({
        filter: req.query,
        skip,
        limit,
    });
    if (result.err) {
        res.status(500).send(result.err);
    } else {
        res.send(result.categories).status(200);
    }
});

router.get('/:id', async function (req, res) {
    const id = req.params.id;
    res.json({});
});

router.post('/', async function (req, res) {
    const category = req.body.category;
    res.json({});
});

router.put('/:id', async function (req, res) {
    const id = req.params.id;
    res.json({});
});

export const categoryRoutes = router;
