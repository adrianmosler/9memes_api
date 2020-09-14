const User = require('../models/user.schema');
const bcrypt = require('bcrypt');
const _ = require('underscore');

import * as express from 'express';

const router = express.Router();

router.get('/', async function (req, res) {
    let begin = req.query.begin || 0;
    begin = Number(begin);

    let end = req.query.end || 10;
    end = Number(end);

    User.find({})
        .skip(begin)
        .limit(end)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                users,
            });
        });
});

router.get('/:id', async function (req, res) {
    User.find({ _id: req.params.id }).exec((err, userDB) => {
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado',
                },
            });
        }

        res.json({
            ok: true,
            user: userDB,
        });
    });
});

router.post('/', async function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        userName: body.userName,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    user.save((err, userDB) => {
        if (err) return res.status(400).json({ ok: false, err });

        userDB.password = null;

        res.json({
            ok: true,
            user: userDB,
        });
    });
});

router.put('/:id', async function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'img', 'active']);

    User.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true },
        (err, userDB) => {
            if (!userDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado',
                    },
                });
            }

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                user: userDB,
            });
        }
    );
});

router.delete('/:id', function (req, res) {
    let id = req.params.id;

    let logicDelete = {
        active: false,
    };

    User.findByIdAndUpdate(
        id,
        logicDelete,
        { new: true },
        (err, userLogicDelete) => {
            if (!userLogicDelete) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado',
                    },
                });
            }

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                user: userLogicDelete,
            });
        }
    );
});

export const userRoutes = router;
