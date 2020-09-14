const Comment = require('../models/comment.schema');
const mongoose = require('mongoose');
const _ = require('underscore');

import * as express from 'express';

const router = express.Router();

mongoose.set('useFindAndModify', false);

router.get('/', async function (req, res) {
    let begin = req.query.begin || 0;
    begin = Number(begin);

    let end = req.query.end || 10;
    end = Number(end);

    Comment.find({})
        .skip(begin)
        .limit(end)
        .exec((err, comments) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                comments,
            });
        });
});

router.get('/:id', async function (req, res) {
    Comment.find({ _id: req.params.id }).exec((err, commentDB) => {
        if (!commentDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Comentario no encontrado',
                },
            });
        }

        res.json({
            ok: true,
            commentDB,
        });
    });
});

/** Verificar validez ids */
router.post('/', async function (req, res) {
    let body = req.body;

    let comment = new Comment({
        description: body.description,
        publication: mongoose.Types.ObjectId(body.publication),
        user: mongoose.Types.ObjectId(body.user),
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    comment.save((err, commentDB) => {
        if (err) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            user: commentDB,
        });
    });
});

router.put('/:id', async function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['description', 'publication', 'user']);
    body.updatedAt = new Date();

    Comment.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true },
        (err, commentDB) => {
            if (!commentDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Comentario no encontrado',
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
                comment: commentDB,
            });
        }
    );
});

router.delete('/:id', function (req, res) {
    let id = req.params.id;

    Comment.findByIdAndRemove(id, (err, commentDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        if (commentDeleted == null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Comentario no encontrado',
                },
            });
        }
        return res.status(200).json({
            ok: true,
            error: {
                comment: commentDeleted,
            },
        });
    });
});

export const commentRoutes = router;
