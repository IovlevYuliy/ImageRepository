$(document).ready(function () {
    $("body").on('change', '#radio1', function()
    {
           $("#radio1").val('1');
    });
    $("body").on('change', '#radio2', function()
    {
           $("#radio2").val('2');
    });

    $("body").on('click', '#addimage', function () {
        $('#addmodal').modal('show');
    });

    var img = $('#image');
    var input = $('#openimage');
    input.bind({
        change: function() {
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    $(aImg).removeAttr("width")
                        .removeAttr("height")
                        .css({ width: "", height: "" });
                    aImg.attr('src', e.target.result);
                    $("#size").text($("#image").width() + 'x' + $("#image").height());
                    aImg.attr('width', 350);
                    aImg.attr('height', 200);
                };
            })(img);
            reader.readAsDataURL(this.files[0]);
            var str = input.val();
            $("#newName").val(this.files[0].name);
            $("#weight").text(this.files[0].size + ' байт');
            // $("#size").text($("#image").width() + 'x' + $("#image").height());
            var a = $("#nmDefault");
            a.val(this.files[0].name);
            a.attr('readonly', true);
        }
    });
<<<<<<< .merge_file_a07888

=======
    
>>>>>>> .merge_file_a03380
});

