import * as express from 'express';
import * as ctrCategory from '../controllers/category.controller';
//import { mongo } from 'mongoose';
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
        limit = Number(req.query.limit);
        delete req.query.limit;
    }

    const result = await ctrCategory.getAllCategories({
        filter: req.query,
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
            res.status(400).send(result.err);
        }
    } else {
        res.send(result.categories).status(200);
    }
});

router.get('/:id', async function (req, res) {
    const result = await ctrCategory.getById(req.params.id);
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
        res.send(result.category).status(result.status);
    }
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
