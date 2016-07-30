$(document).ready(function () {
    
    $("body").on('click', '#myImage', function () {
       $("#gallery").load("/getGallery");
    });

    $("body").on('click', '#addImage', function () {
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

