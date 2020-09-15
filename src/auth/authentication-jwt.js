import passport from 'passport';
import userSchema from '../models/user.schema';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

console.log('----------PROBLEMAS--- ACA------CON------PASSPORT');
let opts = {};
//opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
opts.secretOrKey = process.env.KEY + '';
passport.use(
    new Strategy(opts, function (jwtPayload, done) {
        try {
            const user = userSchema.findOne({ _id: jwtPayload.sub });
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    })
);
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
