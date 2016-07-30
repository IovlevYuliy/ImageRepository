
var formidable = require('formidable'),
    fs = require("fs"),
    mongoose = require('mongoose'),
    newPath,
    cnt = -1,
    Img = require('../models/Images'),
    user = require('../models/user'),
    isAuth = require('../passport/isAuthenticated'),
    UserImage = require('../models/UserImage');
module.exports = function (app) {
    app.post('/upload', isAuth, function (request, response) {
        if (request.body.oldname == undefined) {
            var arr = request.body.myfind.split(',');
            Img.find({ tags: {$all: arr} }, function (err, docs) {
                response.render('Gallery', {layout: false, fls: docs, user: request.user});
            });
        }
        else {
            fs.rename('D:/HardWork/ImageRepository/MyProject/public/images/' + request.body.oldname,
                'D:/HardWork/ImageRepository/MyProject/public/images/' + request.body.newname, function (err) {
                });

            if (!Img.findOne({name: request.body.oldname}, function (err, obj) {
                    obj.access = request.body.radiobut;
                    obj.name = request.body.newname;
                    obj.addinfo = request.body.adinfo;
                    obj.description = request.body.descr;
                    obj.user = request.user.username;
                    var mas = request.body.mytags.split(', ');
                    obj.tags = [];
                    if (mas[0] != "") {
                        mas.forEach(function (item, i, arr) {
                            obj.tags.push(item);
                        });
                    }
                    obj.save(function(err)
                    {
                        Img.find({}, function (err, docs) {
                            response.render('Gallery', {layout: false, fls: docs, user: request.user});
                        });
                    });
                }));
            }
    });

    app.get('/upload', isAuth, function (req, res) {
        Img.find({}, function (err, docs) {
            res.render('upload', {fls: docs, user:req.user, pg: '/upload'});
        });
    });
    
    
    // function nextImg(response)
    // {
    //     cnt++;
    //     Img.find({}, function (err, docs) {
    //         if (cnt == docs.length)
    //             cnt = 0;
    //         response.render('upload', {path: docs[cnt].name});
    //         });
    // }


    app.post('/addImg',function (request, response) {
        var form = new formidable.IncomingForm();
        var qweqwrwe = 1;
        form.encoding = 'utf-8';
        form.parse(request, function(error, fields, files) {
            fs.readFile(files.upload.path, function (err, data) {
                newPath = "D:/HardWork/ImageRepository/MyProject/public/images/" + files.upload.name;
                fs.writeFile(newPath, data, function (err) {
                    if (!Img.findOne({name: files.upload.name}, function (err, obj) {
                            if (!obj) {
                                var obj = new Img({'name': files.upload.name,
                                'addinfo': fields.imginfo, 'description':  fields.imgdesc, 'access': "",
                                    'user': request.user.username, 'size': fields.size, 'weight': fields.weight});
                                var mas = fields.tags.split(',');
                                mas.forEach(function(item, i, arr) {
                                    obj.tags.push(item);
                                });
                                if(fields.optradio == '1')
                                    obj.access = 'private';
                                else
                                    obj.access = 'public';
                                obj.save();
                            }
                        }));
                });
            });
        });
    });

    app.post('/addtome',
        function (request, response) {
            UserImage.findOne({'UserId':request.body.UserId, 'ImageId' : request.body.ImageId},
            function (err, obj) {
                if (err)
                    response.send(err);
                if (obj) {
                    response.send('Вы уже добавляли данное изображение');
                }
                else {

                    var ui = new UserImage({'UserId': request.body.UserId, 'ImageId': request.body.ImageId});
                    ui.save(function (err) {
                        console.log(err);
                    });
                }
            });
       }
    );
};