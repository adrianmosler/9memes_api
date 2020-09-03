const User = require('../models/User.schema');
const bcrypt = require('bcrypt');

import * as express from 'express';

const router = express.Router();

router.get('/', async function (req, res) {
    let begin = req.query.begin || 0;
    begin = Number(begin);

    let end = req.query.end || 5;
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

router.post('/', async function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        userName: body.userName,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
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

export const userRoutes = router;
