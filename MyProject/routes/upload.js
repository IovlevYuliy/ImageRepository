
var formidable = require('formidable'),
    fs = require("fs"),
    mongoose = require('mongoose'),
    newPath,
    cnt = -1,
    Img = require('../models/Images');
module.exports = function (app) {

    app.post('/upload', function (request, response)
    {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.parse(request, function(error, fields, files) {
            fs.readFile(files.upload.path, function (err, data) {
                newPath = "D:/MyProject/public/images/" + files.upload.name;
                fs.writeFile(newPath, data, function (err) {
                    if (!Img.findOne({name: files.upload.name}, function(err, obj){
                            if (!obj) {
                                var obj = new Img({'name': files.upload.name, 'link': "D:/MyProject/public/images/"});
                                obj.save();
                                cur = Img.find({'name': files.upload.name});
                            }
                        }));
                });
            });
            Img.find({}, function (err, docs) {
                response.render('upload', {fls: docs});
            });
            // response.render('upload', {path: files.upload.name});

        });
    });


    app.get('/upload', function (req, res) {
        Img.find({}, function (err, docs) {
            res.render('upload', {fls: docs});
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
    // function show() {
    //     fs.readFile(newPath, "binary", function(error, file) {
    //         if(error) {
    //             response.writeHead(500, {"Content-Type": "text/plain"});
    //             response.write(error + "\n");
    //             response.end();
    //         } else {
    //             response.writeHead(200, {"Content-Type": "image/png"});
    //             response.write(file, "binary");
    //             response.end();
    //         }
    //     });
    // }

};
