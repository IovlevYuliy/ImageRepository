$(document).ready(function () {
    $("body").on('change', '#radio1', function()
    {
           $("#radio1").val('1');
    });
    $("body").on('change', '#radio2', function()
    {
           $("#radio2").val('2');
    });

    
    $("body").on('click', '#addok', function () {
        $('#addmodal').modal('hide');
    });


    $("body").on('click', '#myimg', function () {
       
   //     $('#myimg').fancybox().add(input(type='button'));
});
    var img = $('#image');
    var input = $('#openimage');
    input.bind({
        change: function() {
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    $("#size").attr('style', 'list-style:square');
                    $("#weight").attr('style', 'list-style:square');
                    $(aImg).removeAttr("width")
                        .removeAttr("height")
                        .css({ width: "", height: "" });
                    aImg.attr('src', e.target.result);
                    $("#size").text($("#image").width() + 'x' + $("#image").height());
                    $("#sz").val($("#image").width() + 'x' + $("#image").height());
                    aImg.attr('width', '100%');
                    aImg.attr('height', '100%');
                };
            })(img);
            reader.readAsDataURL(this.files[0]);
            var str = input.val();
            
            $("#newName").val(this.files[0].name);
            $("#weight").text(this.files[0].size + ' байт');
            $("#wt").val(this.files[0].size);
            var a = $("#nmDefault");
            a.val(this.files[0].name);
            a.attr('readonly', true);
        }
    });
});

