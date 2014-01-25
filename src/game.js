var lstShapes = {}

//Assets
var fpsLabel     = '';
var Player       = null;
var background   = null;
var messageField = null;

function main() 
{
    if (!createjs.Sound.initializeDefaultPlugins()) {
        alert("Cannot initializeDefaultPlugins");
        return;
    }

    //Major Structures
    Canvas      = new _Canvas($("#mainCanvas")[0]);
    Mouse       = new _Mouse();
    Stage       = new createjs.Stage("mainCanvas");
    Background  = new _Background(Paths.background_image, 1568, 848);

    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    messageField = new createjs.Text("Loading", "bold 24px Arial", "#000000");
    messageField.maxWidth = 1000;
    messageField.textAlign = "center";
    messageField.x = Canvas.width / 2;
    messageField.y = Canvas.height / 2;
    Stage.addChild(messageField);
    Stage.update();

    if (LOCALHOST)
    {
        var manifest = [
            {id:"collision", src:"sounds/hit.wav"}
        ];
    }
    else
    {
        var manifest = [
            {id:"collision", src:"sounds/hit.wav"},
            {id:"bg_music", src:"sounds/tgt.mp3"}
        ];
    }
    

    preload = new createjs.LoadQueue();
    preload.installPlugin(createjs.Sound);
    if (!LOCALHOST)
        preload.addEventListener("complete", doneLoading);
    else
        preload.addEventListener("complete", init);
    preload.addEventListener("progress", updateLoading);
    preload.loadManifest(manifest);

}
function updateLoading()
{
    messageField.text = "Loading " + (preload.progress*100|0) + "%"
    Stage.update();
}
function doneLoading()
{
    messageField.text = "Click to  P L A Y!";
    createjs.Sound.play("bg_music", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.4);
    Stage.addChild(messageField);
    Stage.update();
    Canvas.tag.onclick = init;
}

function init()
{
    Canvas.tag.onclick = null;
    Stage.removeAllChildren();

    //Assets
    fpsLabel    = new createjs.Text("-- fps", "bold 18px Arial", "#000");

    //Structures
    Player = new _Player();

    setPos(Player.obj, 300, 500);
    setPos(fpsLabel, 10, 20);

    //Objects added example
    Stage.addChild(Background.obj);
    Stage.addChild(Player.obj);
    Stage.addChild(fpsLabel);



    //Tutorial
    setTimeout(function(){
        snotify(400, 200, "Use the arrow keys to move around", "info");
    }, 1000);
    setTimeout(function(){
        snotify(100, 100, "You can mute the music pressing S", "info");
    }, 5000);


    if (!createjs.Ticker.hasEventListener("tick")) { 
        createjs.Ticker.addEventListener("tick", gameLoop);
    }
    createjs.Ticker.setFPS(80);

    //Clean mouse positons
    setInterval(function(){
        for(var k in lstShapes)
        {
            if (typeof Users[k] == 'undefined')
            {
                Stage.removeChild(lstShapes[k]);
                delete lstShapes[k];
            }
                
        }
    }, 5000);


}

function gameLoop()
{
    //FPS label
    fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
    
    //Update mouse's positions
    for(var key in Users)
    {
        var user_key = {x: Users[key].x * Canvas.width, y: Users[key].y * Canvas.height};
        if (typeof lstShapes[key] == 'undefined') {
            lstShapes[key] = new createjs.Shape();
            lstShapes[key].graphics.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)).drawRoundRect(0, 0, 5, 5, 1);
            Stage.addChild(lstShapes[key]);
        }
        //Check for explosion
        if (distance(Player.obj, user_key) < 5)
            createExplosion(Player.obj.x, Player.obj.y);
        setPos(lstShapes[key], user_key.x, user_key.y);
    }    
    //Update particles
    for (var i=0; i<particles.length; i++)
        particles[i].update();
    
    if (Key.isDown(Key.S))
    {
        if (createjs.Sound.getMute())
            createjs.Sound.setMute(false);
        else
            createjs.Sound.setMute(true);
    }

    Player.update();
    Stage.update();
}

