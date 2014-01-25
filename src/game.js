var lstShapes = {}

//Assets
var fpsLabel     = '';
var gamer        = null;
var background   = null;
var messageField = null;
var loading_length = 290;
var loading_rect = null;

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
    Background = new _Background(Image_Path+"loading.png", 1806, 1148);    

    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    loading_rect = new createjs.Shape();
    loading_rect.graphics.beginFill("#7ba800").drawRect(Canvas.width / 2-(loading_length/2), Canvas.height*0.77, 10, 35);
    Stage.addChild(Background.obj);
    Stage.addChild(loading_rect);
    Stage.update();


    if (LOCALHOST)
    {
        var manifest = [
            {id:"collision", src:Sound_Path+"hit.wav"},
            {id:"bg_image", src:Image_Path+"forest_bg.jpg"},
            {id:"character_sprit", src:Image_Path+"Anaconda.png"}
        ];
    }
    else
    {
        var manifest = [
            {id:"collision", src:Sound_Path+"hit.wav"},
            {id:"bg_music", src:Sound_Path+"tgt.mp3"},
            {id:"bg_image", src:Image_Path+"forest_bg.jpg"},
            {id:"character_sprit", src:Image_Path+"Anaconda.png"}
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
    loading_rect.graphics.beginFill("#7ba800").drawRect(Canvas.width / 2-(loading_length/2), Canvas.height*0.77, loading_length*(preload.progress*100|0)/100, 35);
    Stage.update();
}
function doneLoading()
{
    Stage.removeAllChildren();
    Background = new _Background(Image_Path+"ready.png", 1804, 1142);
    createjs.Sound.play("bg_music", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.4);
    Canvas.tag.onclick = init;
    Stage.addChild(Background.obj);
    Stage.update();
}

function init()
{
    Canvas.tag.onclick = null;
    Stage.removeAllChildren();
    Background  = new _Background(Image_Path+"tela_01.jpg", 1920, 1200);

    //Assets
    fpsLabel    = new createjs.Text("-- fps", "bold 18px Arial", "#000");

    //Structures
    gamer = new Player();

    setPos(gamer.obj, 300, 500);
    setPos(fpsLabel, 10, 20);

    //Objects added example
    Stage.addChild(Background.obj);
    Stage.addChild(gamer.obj);
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
        if (typeof lstShapes[key] == 'undefined') {
            lstShapes[key] = new createjs.Shape();
            lstShapes[key].graphics.beginFill('#'+Math.floor(Math.random()*16777215).toString(16)).drawRoundRect(0, 0, 5, 5, 1);
            Stage.addChild(lstShapes[key]);
        }
        //Check for explosion
        if (distance(Mouse, Users[key]) < 5)
            createExplosion(Mouse.x, Mouse.y);
        setPos(lstShapes[key], Users[key].x, Users[key].y);
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

    gamer.update();
    Stage.update();
}

