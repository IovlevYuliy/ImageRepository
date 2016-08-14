$(document).ready(function () {
    $("body").on('change', '#radio1', function()
    {
           $("#addmodal #radio1").val('private');
    });
    $("body").on('change', '#radio2', function()
    {
           $("#addmodal #radio2").val('public');
    });

    
    // $("body").on('click', '#addok', function () {
    //     $('#addmodal').modal('hide');
    // });


    $("body").on('click', '#myimg', function () {
       
   //     $('#myimg').fancybox().add(input(type='button'));
});
    var img = $('#addmodal #image');
    var input = $('#addmodal #openimage');
    input.bind({
        change: function() {
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
            reader.readAsDataURL(this.files[0]);
            var str = input.val();
            
            $("#addmodal #newName").val(this.files[0].name);
            $("#addmodal #weight").text(this.files[0].size + ' байт');
            $("#addmodal #wt").val(this.files[0].size);
            var a = $("#addmodal #nmDefault");
            a.val(this.files[0].name);
            a.attr('readonly', true);
        }
    });
});

