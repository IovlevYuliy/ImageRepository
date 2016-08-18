$(document).ready(function () {

    $("body").on('click', '#myImage', function () {
        $("#gallery").load("/getGallery", {place: window.location.pathname, numpage: 1});
    });
    $("body").on('click', '#profile', function () {
        $("#gallery").load("/profile");
    });
});

