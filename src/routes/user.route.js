// const bcrypt = require('bcrypt');
const _ = require('underscore');

import passport from 'passport';
import * as express from 'express';
const router = express.Router();

import User from './../models/user.schema';
import * as ctrUser from './../controllers/user.controller';

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

router.post('/login', passport.authenticate('local'), function (req, res) {
    // req.session.save((err) => {
    //     if (err) {
    //         return { err };
    //     }
    //     res.redirect('/');
    // });
    console.log('--------req', req);
    console.log('res=>', res);
    //res.json(res);
    res.redirect('/publication');
    // if (!res) {
    //     return {
    //         err: 'Error en auteticatión',
    //         status: 400,
    //         user: null,
    //     };
    // } else {
    //     return {
    //         user: res,
    //         status: 200,
    //     };
    // }
});

router.post('/signup', async function (req, res) {
    const resp = await ctrUser.register(req.body);
    if (resp.err) {
        res.status(resp.status).json({ ok: false, err: resp.err });
    } else {
        res.json({
            ok: true,
            user: resp.userDB,
        });
    }
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
