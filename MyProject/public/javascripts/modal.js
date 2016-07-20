
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
                    aImg.attr('width', 200);
                    aImg.attr('height', 200);
                };
            })(img);
            reader.readAsDataURL(this.files[0]);
            $("li#fileName").text( this.files[0].name);
        }
    });
});

