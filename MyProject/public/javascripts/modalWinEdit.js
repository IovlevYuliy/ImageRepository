$(document).ready(function () {

    $("body").on('change', '#radio1', function()
    {
        $("#radio1").val('1');
    });
    $("body").on('change', '#radio2', function()
    {
        $("#radio2").val('2');
    });
    //move to addWindow
    $("body").on('click', '#galleryblock #openimage', function () {
        var pp = '/images/' + $(this).data('img').name;
        $("#modalopen #image").attr('src', pp);
        var obj = $(this).data('img');
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

        $('#modalopen').modal('show');
    });
    // var img = $('#image');
    // var input = $('#openimage');
    // input.bind({
    //     change: function() {
    //
    //         // var reader = new FileReader();
    //         // reader.onload = (function (aImg) {
    //         //     return function (e) {
    //         //         $(aImg).removeAttr("width")
    //         //             .removeAttr("height")
    //         //             .css({ width: "", height: "" });
    //         //         aImg.attr('src', e.target.result);
    //         //
    //         //         aImg.attr('width', 350);
    //         //         aImg.attr('height', 200);
    //         //     };
    //         // })(img);
    //         // reader.readAsDataURL(this.files[0]);
    //         // var str = input.val();
    //         // $("#newName").val(this.files[0].name);
    //         // $("#weight").text(this.files[0].size + ' байт');
    //         //
    //         // var a = $("#nmDefault");
    //         // a.val(this.files[0].name);
    //         // a.attr('readonly', true);
    //     }
    // });
});

