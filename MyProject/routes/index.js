
module.exports = function(app){

    app.get('/',function (req, res) {
        res.render('index', { message: req.flash('message') });
    });

    app.get('/index',function (req, res) {
        res.render('index', { message: req.flash('message') });
    });

    
};