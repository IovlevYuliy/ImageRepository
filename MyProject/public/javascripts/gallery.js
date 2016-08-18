$(document).ready(function () {
    var body = $('body');

    $("a.fancyimage").fancybox();
   


    //Функция next(следующая страница с изображениями)
    body.on('click', '#next', function () {
        var countpages = Math.cell(($("#hidden").data('fls').length + 9) / 10);
        if (parseInt($("#li_5").children()[0].text) < countpages) {
            var mas = $("a[name='page']");
            var curpage = $("#hidden").data('pg');
            $("li.active").removeClass('active');
            mas.each(function (i, obj) {
                var num = parseInt($(obj).text()) + 5;
                $(obj).text(num);
            });

            var num = curpage % 5;
            if (!num)
                num = 5;
            if (curpage >= parseInt($("#li_1").children()[0].text) && curpage <= parseInt($("#li_5").children()[0].text))
                $("#li_" + num).addClass('active');
        }
    });

    //Функция prev(Предыдущая страница с изображениями)
    body.on('click', '#prev', function () {
        if ($("#li_1").children()[0].text == '1')
            return;
        var mas = $("a[name='page']");
        mas.each(function (i, obj) {
            var num = parseInt($(obj).text()) - 5;
            if (num > 0)
                $(obj).text(num);
        });

        var curpage = $("#hidden").data('pg');
        $("li.active").removeClass('active');
        var num = curpage % 5;
        if (!num)

            num = 5;
        if (curpage >= parseInt($("#li_1").children()[0].text) && curpage <= parseInt($("#li_5").children()[0].text))
            $("#li_" + num).addClass('active');
    });

    //Конкретная страница с изображениями
    body.on('click', '#pg', function () {
        var pg = parseInt($(this).text());
            $("#gallery").load("/getGallery", {numpage: pg, place: window.location}, function () {
        })
    });

    //Удалить изображение из галереи
    body.on('click', '#removeImage', function () {
        $.ajax({
            url: "/removeImage",
            type: "POST",
            data: {
                imageId: $(this).data('imgid'),
                imageName: $(this).data('imgname')
            },
            cache: true,
            timeout: 5000,
            success: function (data) {
                $('#gallery').load('/getGallery', {numpage: 1, place: window.location.pathname})
            }
        })
    });

    //Обработчик поиска по тегам
    body.on("click", "#findme", function(){
        $("#gallery").load("/findImages", {
            myfind: $("#tagsSearch").val(),
            place: window.location.pathname
        });
    });
});

