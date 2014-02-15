//Objects
var Canvas            = null;
var Mouse             = null;
var Stage             = null;
var EnemiesList       = {};
var UserList          = {};
var Player            = null;
var StageObjects      = null;
var GameState         = null;
var Text_input        = false;

var Image_Path        = "./assets/images/";
var Sound_Path        = "./assets/sounds/";
var last_user_removed = null;
var latencyLabel      = '';

//Mouse constructor
function _Mouse() {this.x=0; this.y=0;}
function _Canvas(tag_object) {
    this.tag = tag_object;
    //XX - Resize
    this.context = this.tag.getContext('2d');
    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    /*this.tag.addEventListener('mousemove', function(evt) 
    {
        var rect = this.getBoundingClientRect();
        common.setPos(Mouse, evt.clientX - rect.left, evt.clientY - rect.top);
        $("#canvasCoord").html(Mouse.x +", " + Mouse.y);
    }, false);*/
}
function _Background(srcpath, width, height)
{
    this.obj = new createjs.Bitmap(srcpath);
    this.obj.setTransform(x=0, y=0, scaleX=Canvas.width/width, scaleY=Canvas.height/height);
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
