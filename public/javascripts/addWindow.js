$(document).ready(function () {

    var body = $('body');

    $('#addmodal #tags').tokenfield({
        limit: 10,
        delay: 100
    });

    var listOfFiles = [], SelectfileSizes = [];

    var Selectfiles;
    $('input[type=file]').change(function(){
        Selectfiles = this.files;
    });

    function    OneLoadFunc(fileinput)
    {
        $("#addmodal #filesName").hide();
        $("#addmodal #image").show();
        $("#addmodal #labelsize").show();
        $("#addmodal #size").show();
        $("#addmodal #weight").show();
        $("#addmodal #fileNameLabel").show();
        $("#addmodal #nmDefault").show();
        $("#addmodal #weight").show();
        $("#addmodal #newFileNamelLabel").show();
        $("#addmodal #newName").show();
        $("#addmodal #labelsize").show();

        $("#addmodal #filesName").hide();
        var reader = new FileReader();
        reader.onload = (function (aImg) {
            return function (e) {
                $("#addmodal #size").attr('style', 'list-style:square');
                $("#addmodal #weight").attr('style', 'list-style:square');
                $(aImg).removeAttr("width")
                    .removeAttr("height")
                    .css({ width: "", height: "" });
                aImg.attr('src', e.target.result);
                $("#addmodal #size").text(img.width() + 'x' + img.height());
                SelectfileSizes.push((img.width() + 'x' + img.height()).toString());
                aImg.attr('width', '100%');
                aImg.attr('height', '100%');
            };
        })(img);
        reader.readAsDataURL(fileinput.files[0]);

        $("#addmodal #newName").val(fileinput.files[0].name);
        $("#addmodal #weight").text(fileinput.files[0].size + ' байт');
        $("#addmodal #wt").val(fileinput.files[0].size);
        $("#addmodal #nmDefault").val(fileinput.files[0].name);
    }

    function  MultiLoadFunc(fileinput) {
        $("#addmodal #filesName").show();
        $("#addmodal #filesName").text("");
        $("#addmodal #image").hide();
        $("#addmodal #size").hide();
        $("#addmodal #weight").hide();
        $("#addmodal #fileNameLabel").hide();
        $("#addmodal #nmDefault").hide();
        $("#addmodal #weight").hide();
        $("#addmodal #newFileNamelLabel").hide();
        $("#addmodal #newName").hide();
        $("#addmodal #labelsize").hide();

        var listFileNames = document.getElementById("filesName");
        for (var i = 0; i < fileinput.files.length; i++) {
            var option = document.createElement("option");
            option.text = (i + 1).toString() + '. ' + fileinput.files[i].name;
            listFileNames.add(option);

            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    $(aImg).removeAttr("width")
                        .removeAttr("height")
                        .css({ width: "", height: "" });
                    aImg.attr('src', e.target.result);
                    SelectfileSizes.push((img.width() + 'x' + img.height()).toString());
                    aImg.attr('width', '100%');
                    aImg.attr('height', '100%');
                };
            })(img);
            reader.readAsDataURL(fileinput.files[i]);
        }
    }

    //Отображение миниатюры изображения
    var img = $('#addmodal #image');
    var input = $('#addmodal #openimage');
    input.bind({
        change: function() {
            SelectfileSizes.length = 0;
            if (this.files.length > 1) {
                MultiLoadFunc(this);
            }
            else {
                OneLoadFunc(this);
            }
        }
    });

    //Обработчик для пояления модального окна для добавления изображения
    body.on('click', '#addImage', function () {
        $(".alert").hide();
        document.myform.reset();
        document.myform.image.src = '';

        $("#addmodal #size").attr('style', 'list-style:none');
        $("#addmodal #weight").attr('style', 'list-style:none');
        $("#addmodal #size").text("");
        $("#addmodal #weight").text("");
        $("#addmodal #labelsize").hide();
        $("#addmodal #fileNameLabel").show();
        $("#addmodal #nmDefault").show();
        $("#addmodal #newFileNamelLabel").show();
        $("#addmodal #newName").show();
        $("#addmodal #filesName").hide();
        $("#addmodal #image").hide();

        $("#addmodal #tags").tokenfield('setTokens', ' ');

        $('#addmodal').modal('show');
    });
    
    //Обработчик для отправки изображения на сервер
    body.on('click', '#addok', function () {
        // if(!document.getElementById('addImageForm').checkValidity())
        // {
        //     $("#addImageForm #dangerMsg").show();
        //     return;
        // }
        var data = new FormData(document.forms[2]);

        for (var i = 0; i < Selectfiles.length; ++i) {
            data.append(Selectfiles[i].name + i, Selectfiles[i]);
            data.append(Selectfiles[i].name + i + '_size', SelectfileSizes[i]);
        }

        data.append('place', window.location.pathname);
        data.append('numpage', 1);

        $.ajax({
            url : "/addImage",
            type: 'post',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                $('#addmodal').modal('hide');
                $('#leftMenu li.active').removeClass('active');
                $("#liMyImage").addClass('active');
                
                $("#gallery").html(data);
            },
            beforeSubmit: function () {
                $("#addmodal #dangerMsg").hide();
                $("#addmodal #successMsg").show();
            }
        });
    });
});

