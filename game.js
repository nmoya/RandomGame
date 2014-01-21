var lstShapes = {}

//Assets
var fpsLabel    = '';
var circle      = null;
var animation   = null;

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

    //createExplosion(400, 400, "orange");
}

function gameLoop()
{
    //FPS label
    fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";

    //Move sprites
    setPos(circle, circle.x+5, circle.y);
    setPos(animation, animation.x+1, animation.y+1);
    if (outOfCanvas(circle))
        setPos(circle, randomInt(0, Canvas.width), randomInt(0, Canvas.height));

    if (outOfCanvas(animation))
        setPos(animation, randomInt(0, Canvas.width), randomInt(0, Canvas.height));
    
    //Update mouse's positions
    for(var key in Players)
    {
        if (typeof lstShapes[key] == 'undefined') {
            lstShapes[key] = new createjs.Shape();
            lstShapes[key].graphics.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)).drawRoundRect(0, 0, 5, 5, 1);
            Stage.addChild(lstShapes[key]);
        }
        //Check for explosion
        if (distance(Mouse, Players[key]) < 5)
            createExplosion(Mouse.x, Mouse.y);
        setPos(lstShapes[key], Players[key].x, Players[key].y);
    }
    //Update particles
    for (var i=0; i<particles.length; i++)
        particles[i].update();
    
    //Update canvas from EaselJS
    Stage.update();
}

