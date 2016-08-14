$(document).ready(function () {

    $("body").on('click', '#myImage', function () {
        $("#gallery").load("/getGallery", {place: 'myRoom', numpage: 1});
    });
});

