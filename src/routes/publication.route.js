import * as express from 'express';
import * as ctrPublication from '../controllers/publication.controller';
import { publicationSchema } from '../models/publication.schema';
import * as path from 'path';
import * as fs from 'fs';
import passport from 'passport';
import userSchema from './../models/user.schema';

const router = express.Router();

const limitDefault = 20;

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
                message: 'Error al realizar la consulta',
                error: result.err,
            });
        } else {
            res.status(result.status).send(result.err);
        }
    } else {
        res.send(result.publication).status(result.status);
    }
});

router.get('/img/:img', async function (req, res) {
    const pathImg = path.resolve(__dirname, '../uploads/' + req.params.img);
    const pathNoImg = path.resolve(__dirname, '../assets/images/no_image.jpg');

    if (fs.existsSync(pathImg)) res.sendFile(pathImg);
    else res.sendFile(pathNoImg);
});

/**
 * middleware para check authorización con jwt
 */
async function authorized(req, res, next) {
    await passport.authenticate(
        'jwt',
        { session: false },
        async (error, user) => {
            if (error || !user) {
                res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const userFound = await userSchema.findOne({
                    email: user.email,
                });
                req.user = userFound;
            } catch (err) {
                next({ err, status: 500 });
            }
            next();
        }
    )(req, res, next);
}

router.post('/', authorized, async function (req, res) {
    if (req.user) {
        const resp = await ctrPublication.save(req);
        if (resp.err) {
            if (resp.status === 500) {
                res.status(500).send({
                    message: 'Error al realizar la consulta',
                    error: resp.err,
                });
            } else {
                res.status(resp.status).send(resp.err);
            }
        } else {
            res.send(resp.publication).status(resp.status);
        }
    }
});

router.put('/:id', async function (req, res) {
    const id = req.params.id;
    res.json({});
});

export const publicationRoutes = router;
