var passport = require('passport');

module.exports = function (app) {

    app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash : true
    }));

    app.get('/signup', function (req, res) {
        res.render('signup', {message: req.flash('message')});
    });
    
    
};