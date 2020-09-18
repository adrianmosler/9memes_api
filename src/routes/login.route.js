const User = require('../models/user.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import * as express from 'express';

const router = express.Router();


router.post('/', async function (req, res) {
    let body = req.body;

    User.findOne({ email : body.email }, (err, userBD) => {

        if(err){
            return res.status(400).json({
                ok : false,
                err
            });
        }

        if(!userBD){
            return res.status(400).json({
                ok : false,
                err : {
                    message : 'Usuario o contraseña inválidos'
                }
            });
        }

        if( !bcrypt.compareSync(body.password , userBD.password) ){
            return res.status(400).json({
                ok : false,
                err : {
                    message : 'Usuario o contraseña inválidos'
                }
            });
        }

        const token = jwt.sign({
            user : userBD,
        }, '9memes-secret-token', { expiresIn: 60 * 60 * 24 * 30 } );

        res.json({
            ok : true,
            user : userBD,
            token
        });


    });

});



export const loginRoutes = router;
