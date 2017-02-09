const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const authConfig = require('./authConfig');

const app = express();

app.use(session({
    resave: true, //Without this you get a constant warning about default values
    saveUninitialized: true, //Without this you get a constant warning about default values
    secret: 'keyboardcat'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy(authConfig,
    function(accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
    }
));

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: '/auth/me',
    failureRedirect: '/auth/me'
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.get('/auth/me', (req, res) => {
    if (!req.user) {
        res.status(404).send('User not found');
    }

    return res.status(200).send(req.user);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
})
