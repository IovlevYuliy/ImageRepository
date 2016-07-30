var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var expressSession = require('express-session');
var passport = require('passport');
var dbconfig = require('./db');
var flash = require('connect-flash');
var mongoose = require('mongoose');
mongoose.connect(dbconfig.url);
var User = require('./models/user');
var UserImage = require('./models/UserImage');
var Images = require('./models/Images');
var app = express();
app.use(flash());
var express_partial = require("express-partial");
app.use(express_partial());
app.use(expressSession({
    secret: 'beymax',
    cookie: {maxAge: 6000000}
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3001);
app.locals.basedir = 'D:/HardWork/ImageRepository/MyProject/';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport/init');
initPassport(passport);

var isAuthenticated = require('./passport/isAuthenticated');

app.get('/home', isAuthenticated, function (req, res) {
    res.render('home',  { user: req.user });
});

app.get('/myRoom', isAuthenticated, function (req, res) {
    res.render('myRoom', {user: req.user});
});

app.get('/getGallery', function (req, res) {
    UserImage.find({'UserId': req.user._id.toString()}, function (err, result) {
        var arrId = [];
        result.forEach(function (item, i, arr) {
            arrId.push(item.ImageId);
        });
        Images.find({_id: {$in: arrId}}, function (err, docs) {
            res.render('Gallery', {fls: docs, user: req.user, be: false});
        });
    });    
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

var index = require('./routes/index');
index(app);

var login = require('./routes/login');
login(app);

var signup = require('./routes/signup');
signup(app);

var upload = require('./routes/upload');
upload(app);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

var server = http.createServer(app);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
