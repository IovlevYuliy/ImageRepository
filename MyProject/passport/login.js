var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) 
{
    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            // проверка в mongo, существует ли пользователь с таким логином
            User.findOne({'username': username},
                function (err, user) {
                    // В случае возникновения любой ошибки, возврат с помощью метода done
                    if (err)
                        return done(err);
                    // Пользователь не существует, ошибка входа и перенаправление обратно
                    if (!user) {
                        console.log('User Not Found with username ' + username);
                        return done(null, false,
                            req.flash('message', 'User Not found.'));
                    }
                    // Пользователь существует, но пароль введен неверно, ошибка входа
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false,
                            req.flash('message', 'Invalid Password'));
                    }
                    // Пользователь существует и пароль верен, возврат пользователя из
                    // метода done, что будет означать успешную аутентификацию
                    return done(null, user);
                }
            );
        }));
};

var isValidPassword = function(user, password){
    return (user.password == password);
    // return bCrypt.compareSync(password, user.password);
};