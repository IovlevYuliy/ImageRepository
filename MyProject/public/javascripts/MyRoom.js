$(document).ready(function () {

    $("a.fancyimage").fancybox();
   
    $('#modalopen #tags').tokenfield({
        limit: 10,
        delay: 100
    });
    $('#addmodal #tags').tokenfield({
        limit: 10,
        delay: 100
    });

    $("body").on('click', '#myImage', function () {
        $("#gallery").load("/getGallery", {numpage: 1}, function () {
        });
    });
    
    $("body").on('click', '#addImage', function () {
        $(".alert").hide();
        document.myform.reset();
        document.myform.image.src = '';
        $("#addmodal #size").attr('style', 'list-style:none');
        $("#addmodal #weight").attr('style', 'list-style:none');
        $("#addmodal #size").text("");
        $("#addmodal #weight").text("");
        $("#addmodal #tags").tokenfield('setTokens', ' ');
        $('#addmodal').modal('show');
    });
});

