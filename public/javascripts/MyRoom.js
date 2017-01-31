$(document).ready(function () {

    $("body").on('click', '#myImage', function () {
        $("#liProfile").removeClass('active');
        $("#liMyImage").addClass('active');
        $("#gallery").load("/getGallery", {place: window.location.pathname, numpage: 1});
    });
    $("body").on('click', '#profile', function () {
        $("#liMyImage").removeClass('active');
        $("#liProfile").addClass('active');

        $("#gallery").load("/profile");
    });
});

