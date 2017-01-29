$(document).ready(function () {

    $('#modalopen #tags').tokenfield({
        limit: 10,
        delay: 100
    });

    // $("body").on('change', '#radio1', function()
    // {
    //     $("#radio1").val('private');
    // });
    // $("body").on('change', '#radio2', function()
    // {
    //     $("#radio2").val('public');
    // });

    //Функция открытия окна редактирования
    $("body").on('click', '#galleryblock #openimage', function () {
        var pp = '/images/' + $(this).data('img').name;
        $("#modalopen #image").attr('src', pp);
        var obj = $(this).data('img');
        $("#modalopen #id").val(obj._id.toString());
        $("#modalopen #addinfo").val(obj.addinfo);
        $("#modalopen #weight").text(obj.weight + ' байт');
        $("#modalopen #newName").val(obj.name);
        $("#modalopen #size").text(obj.size);
        $("#modalopen #nmDefault").val(obj.name);
        $("#modalopen #descript").text(obj.description);

        $("#modalopen #sz").val($("#modalopen #image").width() + 'x' + $("#modalopen #image").height());
        $("#modalopen #wt").val(obj.weight);

        $("#modalopen #tags").tokenfield('setTokens', obj.tags);
        if (obj.access == 'private')
            $("#modalopen #radio1").attr("checked", true);
        else
            $("#modalopen #radio2").attr("checked", true);

        if ($(this).data('user').username != obj.user)
        {
            $("#modalopen #radio1").attr("disabled", "disabled");
            $("#modalopen #radio2").attr("disabled", "disabled");
        }
        else
        {
            $("#modalopen #radio1").removeAttr('disabled');
            $("#modalopen #radio2").removeAttr('disabled');
        }
        $(".alert").hide();
        $('#modalopen').modal('show');
    });

    //Функция отправки отредактированных данных об изображении
    $('body').on('click', '#saveServer', function () {
        if(!document.getElementById('myform').checkValidity())
        {
            $("#myform #dangerMsg").show();
            return;
        }
        $("#myform #dangerMsg").hide();
        $("#myform #successMsg").show();

        var options = {
            target: '#gallery',
            url: 'saveChanges',
            type: 'post',
            data: {
                place: window.location.pathname,
                numpage: 1
            },
            success: function () {
                $('#modalopen').modal('hide');
            },
            beforeSubmit: function () {
                $("#myform #dangerMsg").hide();
                $("#myform #successMsg").show();
            }
        };
        $('#modalopen #myform').ajaxSubmit(options);
    });

    //Добавление изображения в свой профиль
    $('body').on('click', '#addtome', function () {
        $.ajax({
            url: "/addtome",
            type: "POST",
            data: {
                UserId: $(this).data('userid'),
                ImageId: $(this).data('imgid')
            },
            cache: true,
            timeout: 5000,
            success: function (data) {
                alert(data);
            }
        })
    });
});

