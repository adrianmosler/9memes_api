import passport from 'passport';
import { Strategy } from 'passport-local';
//passport - jwt;
import userSchema from './../models/user.schema';
import ctrUser from './../controllers/user.controller';

const LocalStrategy = passport.use(
    new Strategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        },
        async (email, password, done) => {
            //callback de verificación
            const user = await userSchema.findOne({
                email: RegExp(email, 'i'),
                active: true,
            });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            } else {
                const match = await user.matchPassword(password);
                if (match) {
                    return done(null, user, { message: 'Usuario válido' });
                } else {
                    return done(null, false, {
                        message: 'Password incorrecta',
                    });
                }
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    userSchema.findById(id, (err, user) => {
        done(err, user);
    });
});
