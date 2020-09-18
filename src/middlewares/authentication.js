import { identity } from 'underscore';

 const jwt = require('jsonwebtoken');
 
 export const tokenVerify = (req, res, next) => {
     
    const token = req.get('token');
    jwt.verify(token, '9memes-secret-token', (err,decoded) => {
        if(err){
            return res.status(401).json({
                ok : false,
                err
            });
        }

        req.user = decoded.user;
        next()
    });
    
}