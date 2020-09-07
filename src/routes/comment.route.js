const Comment = require('../models/comment.schema');
var mongoose = require('mongoose');

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

router.post('/', async function (req, res) {
    let body = req.body;

    let comment = new Comment({
        description: body.description,
        publication: mongoose.Types.ObjectId(body.publication),
        user: mongoose.Types.ObjectId(body.user),
    });
    console.log(comment);
    comment.save((err, commentDB) => {
        if (err) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            user: commentDB,
        });
    });
});

export const commentRoutes = router;
