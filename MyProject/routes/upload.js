var formidable = require('formidable'),
    fs = require("fs"),
    mongoose = require('mongoose'),
    newPath,
    cnt = -1,
    Images = require('../models/Images'),
    user = require('../models/user'),
    isAuth = require('../passport/isAuthenticated'),
    UserImage = require('../models/UserImage');

function galleryInMyRoom(request, response) {
    UserImage.find({'UserId': request.user._id.toString()}, function (err, result) {
        var arrId = [];
        result.forEach(function (item, i, arr) {
            arrId.push(item.ImageId);
        });
        Images.find({_id: {$in: arrId}}, function (err, docs) {
            var numpage = 1;
            if(request.body.numpage)
                numpage = request.body.numpage;
            response.render('gallery', {fls: docs, user: request.user, be: false, numpage: numpage});
        });
    });
}

function galleryInCatalog(request, response) {
    Images.find({ access: 'public' }, function (err, docs) {
        var numpage = 1;
        if(request.body.numpage)
            numpage = request.body.numpage;
        response.render('gallery', {fls: docs, user: request.user, be: true, numpage: numpage});
    });
}

var gallery = {};
gallery['myRoom'] = galleryInMyRoom;
gallery['catalog'] = galleryInCatalog;

module.exports = function (app) {

    //Поиск изображения по тегам
    app.post('/findImages', isAuth, function (request, response) {
        var arr = request.body.myfind.split(',');
        Images.find({ tags: {$all: arr} }, function (err, docs) {
            response.render('gallery', {layout: false, fls: docs, user: request.user, be: true});
        });
    });

    //Получение галереи
    app.post('/getGallery', function (request, response) {
        gallery[request.body.place](request, response);
    });

    //Изменение данных о изображении в БД
    app.post('/upload', isAuth, function (request, response) {
        fs.rename('D:/HardWork/ImageRepository/MyProject/public/images/' + request.body.oldname,
            'D:/HardWork/ImageRepository/MyProject/public/images/' + request.body.imgname);

        Images.findOne({_id: request.body.id}, function (err, obj) {
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
                galleryInCatalog(request, response);
            });
        });
    });

    //Загрузка каталога изображений
    app.get('/catalog', isAuth, function (req, res) {
       res.render('catalog', {user:req.user});
    });

    //Добавление изображения в БД
    app.post('/addImg', isAuth, function (request, response) {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.parse(request, function(error, fields, files) {
            var ph = files.upload.path;
            fs.readFile(ph, function (err, data) {
                newPath = "D:/HardWork/ImageRepository/MyProject/public/images/" + fields.imgname;
                fs.writeFile(newPath, data, function (err) {
                    Images.findOne({name: files.upload.name}, function (err, objj) {
                        if (!objj) {
                            var obj = new Images({'name': fields.imgname,
                                'addinfo': fields.imginfo, 'description':  fields.imgdesc, 'access': fields.optradio,
                                'user': request.user.username, 'size': fields.size, 'weight': fields.weight});
                            var mas = fields.tags.split(', ');
                            mas.forEach(function(item, i, arr) {
                                obj.tags.push(item);
                            });
                            obj.save(function(err, obj){
                                var ui = new UserImage({'UserId': request.user._id.toString(), 'ImageId': obj._id.toString()});
                                ui.save(function (err) {
                                    galleryInMyRoom(request, response);
                                });

                            });
                        }
                    })
                });
            });
        });
    });

    //Удаление изображения из БД
    app.post('/removeImage', function (req, res) {
        Images.remove({_id: req.body.imageId},function (err) {
            fs.unlink('D:/HardWork/ImageRepository/MyProject/public/images/' + req.body.imageName, function (err) {
                if(err)
                    console.log(err);
                res.send("OK");
            })
        });
    });

    //Добавление изображения в свой кабинет
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