//Objects
var Canvas      = new Canvas();
var Mouse       = new Mouse();
var Stage       = null;

var particles = [];

//Mouse constructor
function Mouse() {this.x=0; this.y=0;}
function Canvas() {}

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