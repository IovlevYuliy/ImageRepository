var canvas, ctx, points, bufer, action = 'up', Img, filename;
document.getElementById('close-button').addEventListener('click', actionClose);
var listOfobject = [];
var ListOfPolygon = document.getElementById('polygon-list');
var toolBox;
var activeIndex = 0;

document.getElementById('download-button').addEventListener('click',
    function() {
        let cnvs = document.createElement('canvas');
        cnvs.height = Img.height;
        cnvs.width = Img.width;
        let image = new Image();
        image.src = canvas.toDataURL();
        cnvs.getContext('2d').drawImage(image, 0, 0, Img.width, Img.height);
        this.href = cnvs.toDataURL();
        this.download = filename;
    }, false);

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
            fillingColor: 'transparent',
            name: 'Полигон' + (listOfobject.length + 1)
        };
        listOfobject.push(polygon);
        points = new Array(0);
        var item = $('<li>')
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
            .attr('title','Удалить объект')
            .text('X')
            .appendTo(item);
    }
    else
    {
        var qq = $("#loop-alert");
        $("#loop-alert").show();
    }
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

function AddObjectInList(object) {
    var item = $('<li>')
        .addClass('list-group-item list-box')
        .attr({
            'href': '#',
            'onclick': 'return false;'
        })
        .appendTo(ListOfPolygon);
    var icon = $('<div>')
        .addClass('color-icon')
        .css({ 'background-color': object.fillingColor, 'border-color': object.borderColor })
        .appendTo(item);
    var label = $('<div>')
        .addClass('list-box-label')
        .text(object.name)
        .appendTo(item);
    var eraser = $('<div>')
        .addClass('deleteMe')
        .attr('title','Удалить объект')
        .text('X')
        .appendTo(item);
}

function FillListOfObject(){
    listOfobject.length = 0;

    //var index = $("#ActiveSet").data('id');
    var imageObjects = JSON.parse(ListOfSets[activeIndex].objects);
    ListOfPolygon = document.getElementById('polygon-list');
    
    while (ListOfPolygon.firstChild) {
        ListOfPolygon.removeChild(ListOfPolygon.firstChild);
    }

    listOfobject.length = 0;

    if (imageObjects != null) {
        listOfobject = imageObjects;
        listOfobject.forEach(function (obj, j) {
            AddObjectInList(obj);
        });
    }

    points.length = 0;

    CanvasRefresh();
}

function AddNewSet()
{
    var setList = document.getElementById('listOfSets');

    var obj = new Object({
        '_id': null,
        'imageId': ImageId,
        'objects': null
    });

    ListOfSets.push(obj);

    var item = $('<li>')
        .appendTo(setList);
    var set = $('<a>')
        .attr({
            'href': '#'
        })
        .text("Набор объектов " + ListOfSets.length)
        .appendTo(item);

    ListOfSets[activeIndex].objects = JSON.stringify(listOfobject);

    activeIndex = ListOfSets.length - 1;

    //$("#ActiveSet").data('id', set.data('id'));
    $("#ActiveSet").text(set.text());

    FillListOfObject();
}

function RemoveSet(){
    var list = document.getElementById('listOfSets');

    for (i = activeIndex; i < list.childNodes.length; i++) {
        var aItem = list.childNodes[i].childNodes[0];
        aItem.text = "Набор объектов " + i;
    }

    var newIndex = (activeIndex + 1) % ListOfSets.length;
    list.childNodes[activeIndex].remove();
    ListOfSets.splice(activeIndex, 1);

    if (ListOfSets.length == 0)
        AddNewSet();
    else {
        newIndex = (newIndex - 1 + ListOfSets.length) % ListOfSets.length;
        listOfobject = ListOfSets[newIndex].objects;

        $("#ActiveSet").text("Набор объектов " + (newIndex + 1));
        var listHeader = document.getElementById('ActiveSet');
        activeIndex = newIndex;

        FillListOfObject();
    }
}


window.onload = function () {
    initcnvs();

    if (ListOfSets.length == 0)
        AddNewSet();
    else
        FillListOfObject();

    document.body.onclick = function (e) {
        e = e || event;
        target = e.target || e.srcElement;
        if (target.tagName != "INPUT") {
            var inputLabel = document.getElementsByClassName("list-box-label-input");

            if (inputLabel.length != 0)
            {
                AcceptNewLableForPolygon(inputLabel[0]);
            }
        }
    }
};

function SaveImgOnServer(){
    ListOfSets[activeIndex].objects = JSON.stringify(listOfobject);

    $.ajax({
        url: "/SaveEditorImage",
        type: "POST",
        data: {
            list: JSON.stringify(ListOfSets)
        },
        success: function (data) {
            alert("Отправлено на сервер!");
        }
    })
}

$(".dropdown-menu").on('click', 'li a', function(){
    ListOfSets[activeIndex].objects = JSON.stringify(listOfobject);
    var removeIndex = activeIndex;

    var setList = document.getElementById('listOfSets');
    for (i = 0; i < setList.childNodes.length; ++i)
    {
        var elem = setList.childNodes[i].childNodes[0];
        if (elem == this)
        {
            activeIndex = i;
            break;
        }
    }

    $("#ActiveSet").text($(this).text());
    FillListOfObject();
});

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

$('.list-box').delegate(".list-box-label", "dblclick", function() {
    var parentNode = this.parentNode;
    var inp = document.createElement('input');
    inp.type ='text';
    inp.value = this.textContent;
    inp.className = "list-box-label-input";
    activePolygonInList = this.textContent;

    parentNode.replaceChild(inp,this);
    parentNode.children[1].focus();
});

function AcceptNewLableForPolygon(LabelForPolygonName) {
    var divv = document.createElement('div');
    divv.className = "list-box-label";
    divv.textContent = LabelForPolygonName.value;

    let foundElement = LabelForPolygonName.parentNode;
    var polygonList = Array.prototype.slice.call( document.getElementById('polygon-list').children );
    var index = polygonList.indexOf( foundElement );

    listOfobject[index].name= LabelForPolygonName.value;
    LabelForPolygonName.parentNode.replaceChild(divv, LabelForPolygonName);
}

$('.list-box').delegate(".list-box-label-input", "keyup", function(e) {
    if(e.keyCode == 13) {
        AcceptNewLableForPolygon(this);
    }
});

function initcnvs() {
    canvas = document.getElementById("myCanvas");
    WebGL2D.enable(canvas);
    ctx = canvas.getContext("2d");
    Img = document.getElementById("displayimage");
    ctx.drawImage(Img, 0, 0, canvas.width, canvas.height);
    filename = Img.src.replace(/^.*[\\\/]/, '');

    ctx.lineCap = "round";
    points = new Array(0);
    bufer = ctx.getImageData(0, 0, canvas.width, canvas.height);
    toolBox = new MagicToolBox (
        ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'orange', 'none']
    );

}
