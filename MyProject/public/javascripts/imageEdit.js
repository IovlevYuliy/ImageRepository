var canvas, ctx, offsetX, offsetY, points, bufer, action='up';
document.getElementById('closeButton').addEventListener('click', actionClose);

function actionClose() {
    if (points.length > 2)
    {
        ctx.lineTo(points[0][0], points[0][1]);
        ctx.stroke();
        ctx.closePath();
        points = new Array(0);
        printPoints();
        ctx.strokeStyle = getRandomColor();
        bufer = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    else
        alert("Добавьте точки на изображение!")
}

function drawMultiLine()
{
    for (var i = 0; i < points.length;++i)
    {
        if (i == 0)
        {
            ctx.beginPath();
            ctx.moveTo(points[i][0], points[i][1]);
        }
        else
            ctx.lineTo(points[i][0], points[i][1]);
        ctx.arc(points[i][0], points[i][1], 1, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

}

function removeLastPoint() {
    points.pop();
    ctx.putImageData(bufer, 0, 0);
    drawMultiLine();
    printPoints();
}

document.onkeydown = function(e) {
    if ((e.ctrlKey && e.keyCode == 'Z'.charCodeAt(0))) {
        removeLastPoint();
        return false;
    }
};

function getRandomColor() {
    return "#"+((1<<24)*Math.random()|0).toString(16);
}

window.onload = function () {
    canvas = document.getElementById("myCanvas");
    WebGL2D.enable(canvas);
    ctx = canvas.getContext("2d");
    var Img = document.getElementById("displayimage");
    ctx.drawImage(Img, 0, 0, canvas.width, canvas.height);
    initcnvs();
};

$(document).on('click', "#myCanvas", function (event) {
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;

    points.push([x, y]);
    if (points.length == 1) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
    ctx.stroke();
    printPoints();
});

function printPoints()
{
    var str = "";
    for (var i = 0; i < points.length;++i)
        str += "[" + points[i][0] + ", " + points[i][1] + "]\n";
    $('#pointsList').html(str);
}

function initcnvs() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = getRandomColor();
    points = new Array(0);
    bufer = ctx.getImageData(0, 0, canvas.width, canvas.height);
}