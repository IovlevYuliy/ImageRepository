$(document).ready(function () {
    $("body").on('change', '#radio1', function()
    {
        $("#radio1").val('1');
    });
    $("body").on('change', '#radio2', function()
    {
        $("#radio2").val('2');
    });

    $("body").on('click', '#openimage', function () {
        var pp = '/images/' + $(this).data('img').name;
        $("#image").attr('src', pp);
        var obj = $(this).data('img');
        $("#addinfo").val(obj.addinfo);
        $("#weight").text(obj.weight);
        $("#newName").val(obj.name);
        $("#size").text(obj.size + 'байт');
        $("#nmDefault").val(obj.name);
        $("#descript").text(obj.description);
        obj.tags.forEach(function(item, i, arr) {
            $("#tags").tokenfield('setTokens', item);
        });

        if (obj.access == 'private')
            $("#radio1").attr("checked", true);
        else
            $("#radio2").attr("checked", true);
        $('#modalopen').modal('show');
    });
    $("body").on('click', '#saveServer', function () {
        $('#modalopen').modal('hide');
    });

    var img = $('#image');
    var input = $('#openimage');
    input.bind({
        change: function() {

            // var reader = new FileReader();
            // reader.onload = (function (aImg) {
            //     return function (e) {
            //         $(aImg).removeAttr("width")
            //             .removeAttr("height")
            //             .css({ width: "", height: "" });
            //         aImg.attr('src', e.target.result);
            //         $("#size").text($("#image").width() + 'x' + $("#image").height());
            //         $("#sz").val($("#image").width() + 'x' + $("#image").height());
            //         aImg.attr('width', 350);
            //         aImg.attr('height', 200);
            //     };
            // })(img);
            // reader.readAsDataURL(this.files[0]);
            // var str = input.val();
            // $("#newName").val(this.files[0].name);
            // $("#weight").text(this.files[0].size + ' байт');
            // $("#wt").val(this.files[0].size);
            // var a = $("#nmDefault");
            // a.val(this.files[0].name);
            // a.attr('readonly', true);
        }
    });
});

