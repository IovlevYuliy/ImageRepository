$(document).ready(function () {

    $("body").on('click', '#profile', function () {
        $('#leftMenu li.active').removeClass('active');
        $("#liProfile").addClass('active');

        $("#gallery").load("/profile");
    });

    $("body").on('click', '#myImage', function () {
        $('#leftMenu li.active').removeClass('active');
        $("#liMyImage").addClass('active');
        $("#gallery").load("/getGallery", {place: window.location.pathname, numpage: 1});
    });
});

