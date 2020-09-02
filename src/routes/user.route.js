const Usuario = require('../models/user.schema');

import * as express from 'express';

const router = express.Router();

router.get('/user', async function (req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    users,
                    cuantos: conteo,
                });
            });
        });
});

export const userRoutes = router;
