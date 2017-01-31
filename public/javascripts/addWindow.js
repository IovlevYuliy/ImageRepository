$(document).ready(function () {

    var body = $('body');
    // body.on('change', '#radio1', function()
    // {
    //     $("#addmodal #radio1").val('private');
    // });
    // body.on('change', '#radio2', function()
    // {
    //     $("#addmodal #radio2").val('public');
    // });

    $('#addmodal #tags').tokenfield({
        limit: 10,
        delay: 100
    });

    function OneLoadFunc(fileinput)
    {
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
                $("#addmodal #sz").val(img.width() + 'x' + img.height());
                aImg.attr('width', '100%');
                aImg.attr('height', '100%');
            };
        })(img);
        reader.readAsDataURL(fileinput.files[0]);
        var str = input.val();

        $("#addmodal #newName").val(fileinput.files[0].name);
        $("#addmodal #weight").text(fileinput.files[0].size + ' байт');
        $("#addmodal #wt").val(fileinput.files[0].size);
        var a = $("#addmodal #nmDefault");
        a.val(fileinput.files[0].name);
        a.attr('readonly', true);
    }

    function MultiLoadFunc(fileinput) {

        var reader = new FileReader();
        reader.readAsDataURL(fileinput.files[0]);
        var str = input.val();
        var HtmlString = "";
        var x = document.getElementById("filesName");
        for (var i = 0; i < fileinput.files.length; i++) {
            var option = document.createElement("option");
            option.text = (i + 1).toString() + '. ' +  fileinput.files[i].name;
            x.add(option);
            // $("#addmodal #files").val($("#addmodal #files").value + fileinput.files[i].name.toString() + "    ");
        }
        $("#addmodal #filesName").show();
        $("#addmodal #image").hide();
        $("#addmodal #labelsize").hide();
        $("#addmodal #sz").hide();
        $("#addmodal #wt").hide();
        $("#addmodal #size").hide();
        $("#addmodal #weight").hide();
        $("#addmodal #filename").hide();
        $("#addmodal #nmDefault").hide();
        $("#addmodal #weight").hide();

    }

    //Отображение миниатюры изображения
    var img = $('#addmodal #image');
    var input = $('#addmodal #openimage');
    input.bind({
        change: function() {
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

        $("#addmodal #filesName").text("");
        $("#addmodal #filesName").hide();
        $("#addmodal #tags").tokenfield('setTokens', ' ');
        $('#addmodal').modal('show');
    });
    
    //Обработчик для отправки изображения на сервер
    body.on('click', '#addok', function () {
        if(!document.getElementById('addImageForm').checkValidity())
        {
            $("#addImageForm #dangerMsg").show();
            return;
        }

        var options = {
            target: '#gallery',
            url: '/addImage',
            type: 'post',
            data: {
                place: window.location.pathname,
                numpage: 1
            },
            success: function () {
                $('#addmodal').modal('hide');
            },
            beforeSubmit: function () {
                $("#addImageForm #dangerMsg").hide();
                $("#addImageForm #successMsg").show();
            }
        };
        $('#addImageForm').ajaxSubmit(options);
    });
});

