var passport = require('passport');

module.exports = function (app) {

    app.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));
}