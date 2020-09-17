import userSchema from '../models/user.schema';
import { Strategy, ExtractJwt } from 'passport-jwt';

export default function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = process.env.KEY + '';
    passport.use(
        new Strategy(opts, async function (jwtPayload, done) {
            try {
                const user = await userSchema.findOne({
                    _id: jwtPayload.user._id,
                });
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        })
    );
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });
}
