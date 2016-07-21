
$(document).ready(function () {

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
                    aImg.attr('src', e.target.result);
                    $("#size").text($("#image").width() + 'x' + $("#image").height());
                    aImg.attr('width', 350);
                    aImg.attr('height', 200);
                };
            })(img);
            reader.readAsDataURL(this.files[0]);

            $("#newName").val(this.files[0].name);
            $("#weight").text(this.files[0].size + ' байт');
            $("#date").text(this.files[0].lastModifiedDate);
            // $("#size").text($("#image").width() + 'x' + $("#image").height());
            var a = $("#nmDefault");
            a.val(this.files[0].name);
            a.attr('readonly', true);

        }
    });
});

