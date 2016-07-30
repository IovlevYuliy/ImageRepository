
var formidable = require('formidable'),
    fs = require("fs"),
    mongoose = require('mongoose'),
    newPath,
    cnt = -1,
    Img = require('../models/Images'),
    user = require('../models/user'),
    UserImage = require('../models/UserImage'),
    isAuth = require('../passport/isAuthenticated');
module.exports = function (app) {
    app.post('/upload', function (request, response) {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.parse(request, function (error, fields, files) {
            if (fields.oldname == undefined) {
                var arr = fields.imgsearch.split(',');

                Img.find({ tags: {$all: arr} }, function (err, docums) {
                    response.render('upload', {fls: docums});
                } );
            }
            else {
                fs.rename('D:/HardWork/ImageRepository/MyProject/public/images/' + fields.oldname,
                    'D:/HardWork/ImageRepository/MyProject/public/images/' + fields.imgname, function (err) {
                    });

                if (!Img.findOne({name: fields.oldname}, function (err, obj) {
                        // if(fields.optradio == '1')
                        //     obj.access = 'private';
                        // else
                        //     obj.access = 'public';
                        obj.name = fields.imgname;
                        obj.addinfo = fields.imginfo;
                        obj.description = fields.imgdesc;
                        obj.user = request.user.username;
                        var mas = fields.tags.split(',');
                        obj.tags = [];
                        if (mas[0] != "") {
                            mas.forEach(function (item, i, arr) {
                                obj.tags.push(item);
                            });
                        }
                        obj.save(function(err)
                        {
                            Img.find({}, function (err, docs) {
                                response.render('upload', {fls: docs});
                            });
                        });
                    }));
            }
        });
    });

    app.get('/upload', isAuth, function (req, res) {
        Img.find({}, function (err, docs) {
            res.render('upload', {fls: docs, user:req.user});
        });
    });
    
    
    function nextImg(response)
    {
        cnt++;
        Img.find({}, function (err, docs) {
            if (cnt == docs.length)
                cnt = 0;
            response.render('upload', {path: docs[cnt].name});
            });
    }


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