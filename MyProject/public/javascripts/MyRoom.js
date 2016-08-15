$(document).ready(function () {

    $("body").on('click', '#myImage', function () {
        $("#gallery").load("/getGallery", {place: 'myRoom', numpage: 1});
    });
    $("body").on('click', '#profile', function () {
        $("#gallery").load("/profile");
    });
});

