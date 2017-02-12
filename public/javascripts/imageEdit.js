var canvas, ctx, offsetX, offsetY, points, bufer, action = 'up';
document.getElementById('close-button').addEventListener('click', actionClose);

var listOfobject = [];
var ListOfPolygon = document.getElementById('polygon-list');
var toolBox;
function actionClose() {
    if (points.length > 2)
    {
        ctx.lineTo(points[0].x, points[0].y);
        ctx.stroke();
        ctx.closePath();
        points.push(points[0]);
        let polygon = {
            points: points,
            borderColor: ctx.strokeStyle,
            borderSize: ctx.lineWidth,
            fillingColor: 'transparent'
        };
        listOfobject.push(polygon);
        points = new Array(0);
        var item = $('<a>')
            .addClass('list-group-item list-box')
            .attr({
                'href': '#',
                'onclick': 'return false;'
            })
            .appendTo(ListOfPolygon);
        var icon = $('<div>')
            .addClass('color-icon')
            .css({ 'background-color': 'white', 'border-color': ctx.strokeStyle })
            .appendTo(item);
        var label = $('<div>')
            .addClass('list-box-label')
            .text('Полигон ' + listOfobject.length)
            .appendTo(item);
        var eraser = $('<div>')
            .addClass('deleteMe')
            .text('X')
            .appendTo(item);
    }
    else
        alert("Добавьте точки на изображение!")
}



function CanvasRefresh()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(bufer, 0, 0);
    let tmp = ctx.strokeStyle;
    let size = ctx.lineWidth;
    listOfobject.forEach(function (obj) {
        ctx.strokeStyle = obj.borderColor;
        ctx.lineWidth = obj.borderSize;
        ctx.fillStyle = obj.fillingColor;
        for (var i = 0; i < obj.points.length; ++i)
        {
            if (i == 0)
            {
                ctx.beginPath();
                ctx.moveTo(obj.points[i].x, obj.points[i].y);
            }
            else
                ctx.lineTo(obj.points[i].x, obj.points[i].y);
        }
        ctx.closePath();
        if (obj.fillingColor != -1)
            ctx.fill();
        ctx.stroke();
    });

    ctx.strokeStyle = tmp;
    ctx.lineWidth = size;
    for (var i = 0; i < points.length; ++i)
    {
        if (i == 0)
        {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
        }
        else
            ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
    }
}

function removeLastPoint() {
    if (!points.length && !listOfobject.length)
        return;
    if (!points.length) {
        let topPolygon = listOfobject.pop();
        points = topPolygon.points;
        ctx.strokeStyle = topPolygon.borderColor;
        ctx.lineWidth = topPolygon.borderSize;
        ListOfPolygon.removeChild(ListOfPolygon.childNodes[ListOfPolygon.childNodes.length - 1]);
    }
    points.pop();
    CanvasRefresh();
}

document.onkeydown = function(e) {
    if ((e.ctrlKey && e.keyCode == 'Z'.charCodeAt(0))) {
        removeLastPoint();
        return false;
    }
    if ((e.ctrlKey && e.keyCode == 'D'.charCodeAt(0))) {
        actionClose();
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
    // canvas.width = 10 * Img.width;
    // canvas.height = 10 * Img.height;
    // canvas.getContext('2d').drawImage(Img, 0, 0, canvas.width, canvas.height);
    // $(Img).attr('src', canvas.toDataURL("image/png"));
    ctx.drawImage(Img, 0, 0, canvas.width, canvas.height);
    initcnvs();
};

function AddNewVertex(x, y) {
    points.push({x, y});
    if (points.length == 1) {
        ctx.strokeStyle = toolBox.getSelectedColor();
        ctx.lineWidth =   toolBox.getSize();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    else
        ctx.lineTo(x, y);
    ctx.stroke();
}

function IsHitInPolygon(polygon, x, y) {
    let hit = false;
    for (let j = 0; j < polygon.length - 1; j++) {
        let i = j + 1;
        if ((((polygon[i].y <= y) && (y < polygon[j].y)) || ((polygon[j].y <= y) && (y<polygon[i].y)))
            && (x > (polygon[j].x - polygon[i].x) * (y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
            hit = !hit;
        }
    }
    return hit;
}

function CheckFilling(x, y) {
    for (let i = listOfobject.length - 1; i >= 0; --i) {
        if (IsHitInPolygon(listOfobject[i].points, x, y)) {
            listOfobject[i].fillingColor = toolBox.getSelectedColor();
            ListOfPolygon.childNodes[i].childNodes[0].style.backgroundColor = listOfobject[i].fillingColor;
            return true;
        }
    }
    return false;
}

function SquaredDistance(x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

function DeleteNearestPoint(x, y) {
    let polygonIndex = -1, pointIndex = -1, minDist = 1000000000;
    listOfobject.forEach(function (obj, j) {
        if (obj.points.length > 3) {
            for (let i = 0; i < obj.points.length; ++i) {
                let dist = SquaredDistance(x, y, obj.points[i].x, obj.points[i].y);
                if (dist < minDist) {
                    minDist = dist;
                    polygonIndex = j;
                    pointIndex = i;
                }
            }
        }
    });
    if (polygonIndex == -1 || minDist > 25)
        return false;
    listOfobject[polygonIndex].points.splice(pointIndex, 1);
    return true;
}
$(document).on('click', "#myCanvas", function (event) {
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;

    var button = toolBox.getCurrentToolData();
    if (button.attr('id') == "brush-button") {
        AddNewVertex(x, y);
    }
    if (button.attr('id') == "bucket-button") {
        if (CheckFilling(x, y))
            CanvasRefresh();
    }
    if (button.attr('id') == "eraser-button") {
        if (DeleteNearestPoint(x, y))
            CanvasRefresh();
    }

});

$('.list-box').delegate(".deleteMe", "click", function() {
    let index = -1;
    let foundElement = this.parentNode;
    ListOfPolygon.childNodes.forEach(function (obj, j) {
        if (obj === foundElement)
            index = j;
    });
    ListOfPolygon.removeChild(foundElement);
    listOfobject.splice(index, 1);
    CanvasRefresh();
});
function initcnvs() {
    ctx.lineCap = "round";
    points = new Array(0);
    bufer = ctx.getImageData(0, 0, canvas.width, canvas.height);
    toolBox = new MagicToolBox (
        ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'orange', 'none']
    );
}
