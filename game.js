//Objects
var Canvas      = new Canvas();
var Mouse       = new Mouse();
var Stage       = null;


//Assets
var fpsLabel    = '';
var circle      = null;
var animation   = null;

//Mouse constructor
function Mouse() {this.x=0; this.y=0;}
function Canvas() {}

function main() 
{
    init();

    if (!createjs.Ticker.hasEventListener("tick")) { 
        createjs.Ticker.addEventListener("tick", gameLoop);
    }
    createjs.Ticker.setFPS(50);
    
}

function init()
{
    Canvas.tag = $("#mainCanvas")[0];
    //XX - Resize
    Canvas.context = Canvas.tag.getContext('2d');
    Canvas.context.canvas.width = window.innerWidth-30;
    Canvas.context.canvas.height = window.innerHeight-60;
    Canvas.width = window.innerWidth-30;
    Canvas.height = window.innerHeight-60;
    
    Canvas.tag.addEventListener('mousemove', function(evt) {
        var rect = Canvas.tag.getBoundingClientRect();
        setPos(Mouse, evt.clientX - rect.left, evt.clientY - rect.top);
        $("#canvasCoord").html(Mouse.x +", " + Mouse.y);
    }, false);


    //Game functions
    //Create a stage by getting a reference to the canvas
    Stage       = new createjs.Stage("mainCanvas");
    fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#000");
    
    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 40);
    circle.snapToPixel = true;
    circle.cache(-40, -40, 40*2, 40*2);
    

    var data = {
        images: ["/images/Anaconda.png"],
        frames: {width:48, height:48},
        animations: {run:[24,26], jump:[5,8,"run"]}
    };
    var spriteSheet = new createjs.SpriteSheet(data);
    animation = new createjs.Sprite(spriteSheet, "run");


    setPos(animation, 100, 100);
    setPos(circle, 20, 50);
    setPos(fpsLabel, 10, 20);


    Stage.addChild(fpsLabel);
    Stage.addChild(circle);
    Stage.addChild(animation);
}

function gameLoop()
{
    setPos(circle, Mouse.x, Mouse.y);
    setPos(animation, animation.x+1, animation.y);

    if (circle.x > Canvas.width)
        circle.x = 50;
    if (circle.y > Canvas.height)
        circle.y = 50;

    fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
    Stage.update();
}

function setPos (object, x, y) { 
    object.x = x;
    object.y = y;
}