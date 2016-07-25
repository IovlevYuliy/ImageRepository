var passport = require('passport');

module.exports = function (app) {

    app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash : true
    }));

};