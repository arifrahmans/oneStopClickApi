import passport from 'passport';
import LocalStrategy from 'passport-local';
import {
    Strategy as JWTStrategy,
    ExtractJwt
} from 'passport-jwt';

import googleToken from 'passport-google-token'
import TwitterTokenStrategy from 'passport-twitter-token'
import User from '../models/user.models';
import constants from '../config/constants';
const GoogleTokenStrategy = googleToken.Strategy;

// local startegy
const localOpts = {
    usernameField: 'email'
}

const localStrategy = new LocalStrategy(localOpts, async (email, password, done) => {
    try {
        const user = await User.findOne({
            email
        });
        if (!user) {
            return done(null, false);
        } else if (!user.authenticateUser(password)) {
            return done(null, false);
        }

        return done(null, user);
    } catch (e) {
        return done(null, false);
    }
})

// JWT Strategy
const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader('authorization'),
    secretOrKey: constants.JWT_SECRET,
}

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
    try {
        const user = await User.findById(payload._id);      

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});

// Google Token startegy
const googleOpts = {
    clientID: constants.googleAuth.clientID,
    clientSecret: constants.googleAuth.clientSecret,
    callbackURL : constants.googleAuth.callbackURL
}

const googleStrategy = new GoogleTokenStrategy(googleOpts, async (accessToken, refreshToken, profile, done) => {   
    try {
    return User.findOne({
        'googleProvider.id': profile.id
    }, async (err, user) => {
      console.log(user);
        // no user was found, lets create a new one
        if (!user) {
            let newUser = new User({
                userName: profile.displayName,
                email: profile.emails[0].value,
                password: accessToken,
                googleProvider: {
                    id: profile.id,
                    token: accessToken
                }
            });

            await newUser.save((error, savedUser) => {
                if (error) {
                  return done(err, false);
                }
                return done(error, savedUser);
            });
        }else{
            return done(err, user);
        }
    });
    } catch (error) {
        console.log(error)
    }
    
});

// Google Token startegy
const twitterOpts = {
    consumerKey: constants.twitterAuth.consumerKey,
    consumerSecret: constants.twitterAuth.consumerSecret,
    includeEmail: true
}

const twitterStrategy = new TwitterTokenStrategy(twitterOpts, async (token, tokenSecret, profile, done) => {   
    try {
    return User.findOne({
        'twitterProvider.id': profile.id
    }, async (err, user) => {
      console.log(user);
        // no user was found, lets create a new one
        if (!user) {
            let newUser = new User({
                userName: profile.emails[0].value,
                email: profile.emails[0].value,
                password: token,
                twitterProvider: {
                    id: profile.id,
                    token,
                    tokenSecret
                }
            });

            await newUser.save((error, savedUser) => {
                if (error) {
                  return done(err, false);
                }
                return done(error, savedUser);
            });
        }else{
            return done(err, user);
        }
    });
    } catch (error) {
        console.log(error)
    }
    
});


passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(googleStrategy);
passport.use(twitterStrategy);

export const authLocal = passport.authenticate('local', {
    session: false
});
export const authJwt = passport.authenticate('jwt', {
    session: false
});
export const authGoogle = passport.authenticate('google-token', {
    session: false
});
export const authTwitter = passport.authenticate('twitter-token', {
    session: false
});