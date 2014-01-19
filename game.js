//Objects
var Canvas      = new Canvas();
var Mouse       = new Mouse();
var Stage       = null;

lstShapes = {}

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


    //Clean mouse positons
    setInterval(function(){
        for(var k in lstShapes)
        {
            if (typeof Players[k] == 'undefined')
            {
                Stage.removeChild(lstShapes[k]);
                delete lstShapes[k];
            }
                
        }
    }, 5000);
    
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
        User.x = Mouse.x;
        User.y = Mouse.y;
        socket.emit("update_coords", User);
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
        animations: {run:[24,26, "run", 0.1], jump:[5,8,"run", 4]}
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
    setPos(circle, circle.x+1, circle.y+1);
    setPos(animation, animation.x+1, animation.y+1);

    if (circle.x > Canvas.width)
        circle.x = 50;
    if (circle.y > Canvas.height)
        circle.y = 50;

    fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
    console.log(Players);
    for(var key in Players)
    {
        if (typeof lstShapes[key] == 'undefined') {
            lstShapes[key] = new createjs.Shape();
            lstShapes[key].graphics.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)).drawRoundRect(0, 0, 5, 5, 1);
            Stage.addChild(lstShapes[key]);
        }
        setPos(lstShapes[key], Players[key].x, Players[key].y);
    }
    Stage.update();
}

function setPos (object, x, y) { 
    object.x = x;
    object.y = y;
}