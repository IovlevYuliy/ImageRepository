module.exports = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
   // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}