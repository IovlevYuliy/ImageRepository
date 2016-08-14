
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
                response.render('Gallery', {layout: false, fls: docs, user: request.user, be: true});
            });
        }
        else {
            fs.rename('D:/HardWork/ImageRepository/MyProject/public/images/' + request.body.oldname,
                'D:/HardWork/ImageRepository/MyProject/public/images/' + request.body.newname, function (err) {
                });

            if (!Img.findOne({name: request.body.oldname}, function (err, obj) {
                    obj.access = request.body.optradio;
                    obj.name = request.body.imgname;
                    obj.addinfo = request.body.imginfo;
                    obj.description = request.body.imgdesc;
                    obj.user = request.user.username;
                    var mas = request.body.tags.split(', ');
                    obj.tags = [];
                    if (mas[0] != "") {
                        mas.forEach(function (item, i, arr) {
                            obj.tags.push(item);
                        });
                    }
                    obj.save(function(err)
                    {
                        Img.find({ access: 'public' }, function (err, docs) {
                            response.render('Gallery', {layout: false, fls: docs, user: request.user, be: true, numpage: 1});
                        });
                    });
                }));
            }
    });

    app.get('/upload', isAuth, function (req, res) {
       res.render('upload', {user:req.user});
    });

    app.post('/addImg',function (request, response) {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.parse(request, function(error, fields, files) {
            var ph = files.upload.path;
            fs.readFile(ph, function (err, data) {
                newPath = "D:/HardWork/ImageRepository/MyProject/public/images/" + files.upload.name;
                fs.writeFile(newPath, data, function (err) {
                    Img.findOne({name: files.upload.name}, function (err, objj) {
                        if (!objj) {
                            var obj = new Img({'name': fields.imgname,
                                'addinfo': fields.imginfo, 'description':  fields.imgdesc, 'access': fields.optradio,
                                'user': request.user.username, 'size': fields.size, 'weight': fields.weight});
                            var mas = fields.tags.split(', ');
                            mas.forEach(function(item, i, arr) {
                                obj.tags.push(item);
                            });
                            obj.save(function(err, obj){
                                var ui = new UserImage({'UserId': request.user._id.toString(), 'ImageId': obj._id.toString()});
                                ui.save(function (err) {
                                    UserImage.find({'UserId': request.user._id.toString()}, function (err, result) {
                                        var arrId = [];
                                        result.forEach(function (item, i, arr) {
                                            arrId.push(item.ImageId);
                                        });
                                        Img.find({_id: {$in: arrId}}, function (err, docs) {
                                            response.render('Gallery', {fls: docs, user: request.user, be: false, numpage: 1});
                                        });
                                    });
                                });

                            });
                        }
                    })
                });
            });
        });
    });

    app.post('/removeImage', function (req, res) {
        Img.remove({_id: req.body.imageId},function (err) {
            fs.unlink('D:/HardWork/ImageRepository/MyProject/public/images/' + req.body.imageName, function (err) {
                if(err)
                    console.log(err);
                res.send("OK");
            })
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