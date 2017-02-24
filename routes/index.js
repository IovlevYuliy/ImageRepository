module.exports = function(app){

    app.get('/',function (req, res) {
        res.render('index', {user: req.user, message: req.flash('message'),
            userName: req.flash('userName'), userPassword: req.flash('userPassword')});
    });

    app.get('/index',function (req, res) {
            res.render('index', {user: req.user, message: req.flash('message'),
                userName: req.flash('userName'), userPassword: req.flash('userPassword')});
    });

    
};