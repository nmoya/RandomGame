//Objects
var Canvas      = null;
var Mouse       = null;
var Stage       = null;
var Background  = null;
var LOCALHOST   = !document.location.hostname == "localhost"

var particles = [];

var Image_Path = "./images/";
var Sound_Path = "./sounds/";


//Mouse constructor
function _Mouse() {this.x=0; this.y=0;}
function _Canvas(tag_object) {

    this.tag = tag_object;
    //XX - Resize
    this.context = this.tag.getContext('2d');
    this.context.canvas.width = window.innerWidth-30;
    this.context.canvas.height = window.innerHeight-60;
    this.width = window.innerWidth-30;
    this.height = window.innerHeight-60;

    this.tag.addEventListener('mousemove', function(evt) 
    {
        var rect = this.getBoundingClientRect();
        setPos(Mouse, evt.clientX - rect.left, evt.clientY - rect.top);
        $("#canvasCoord").html(Mouse.x +", " + Mouse.y);
        setPos(User, Mouse.x, Mouse.y);
        socket.emit("update_coords", User);
    }, false);
}

function _Background(srcpath, width, height)
{
    this.obj = new createjs.Bitmap(srcpath);
    this.obj.setTransform(x=0, y=0, scaleX=Canvas.width/width, scaleY=Canvas.height/height);
}

function randomFloat(min, max)
{
    return min + Math.random()*(max-min);
}
function randomInt(min, max)
{
    return Math.round(min + Math.random()*(max-min));
}
function setPos (object, x, y) { 
    object.x = x;
    object.y = y;
}
function setPosVec (object, vector) { 
    object.x = vector.x;
    object.y = vector.y;
}
function outOfCanvas(object)
{
    if (object.x < 0 || object.x > Canvas.width)
        return true;
    else if (object.y < 0 || object.y > Canvas.height)
        return true;
    else
        return false;
}
function outOfCanvasX(object)
{
    if (object.x < 0 || object.x > Canvas.width)
        return true;
    else
        return false;
}
function outOfCanvasY(object)
{
    if (object.y < 0 || object.y > Canvas.height)
        return true;
    else
        return false;
}
function distance(object1, object2)
{
    return Math.sqrt( (object1.x-object2.x)*(object1.x-object2.x) + (object1.y-object2.y)*(object1.y-object2.y));
}