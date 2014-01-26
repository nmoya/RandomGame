var lstFriends = {}

//Assets
var fpsLabel     = '';
var Player       = null;
var background   = null;
var messageField = null;
var loading_length = 290;
var loading_rect = null;

var level_label = null;
var alive_label = null;
var gameover_label = null;

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
    Background = new _Background(Image_Path+"loading.jpg", 1806, 1148);    

    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    loading_rect = new createjs.Shape();
    loading_rect.graphics.beginFill("#7ba800").drawRect(Canvas.width / 2-(loading_length/2), Canvas.height*0.77, 10, 35);
    Stage.addChild(Background.obj);
    Stage.addChild(loading_rect);
    Stage.update();

    var manifest = [
        {id:"loading", src:Image_Path+"loading.jpg"},
        {id:"tela_01.png", src:Image_Path+"tela_01.jpg"},
        {id:"collision", src:Sound_Path+"hit.wav"},
        {id:"bg_music", src:Sound_Path+"tgt.mp3"},
    ];

    //Tutorial
    setTimeout(function(){
        gnotify("You MUST protect the leader", "info");
    }, 1000);
    setTimeout(function(){
        gnotify("Use the ARROW keys to move around and SPACE to attack!", "info");
    }, 3000);

    //Créditos
    setTimeout(function(){
        gnotify("Nikolas Moya, programador.", "success");
    }, 12000);
    setTimeout(function(){
        gnotify("Guilherme Mattioli, programador", "success");
    }, 16000);
    setTimeout(function(){
        gnotify("Marilia Ferreira, designer.", "success");
    }, 20000);
    setTimeout(function(){
        gnotify("Rafael Zilio, designer", "success");
    }, 24000);


    preload = new createjs.LoadQueue();
    preload.installPlugin(createjs.Sound);
    preload.addEventListener("complete", init);
    preload.addEventListener("progress", updateLoading);
    preload.loadManifest(manifest);

}
function updateLoading()
{
    loading_rect.graphics.beginFill("#7ba800").drawRect(Canvas.width / 2-(loading_length/2), Canvas.height*0.77, loading_length*(preload.progress*100|0)/100, 35);
    Stage.update();
}

function init()
{
    Canvas.tag.onclick = null;
    Stage.removeAllChildren();
    //createjs.Sound.play("bg_music", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.4);
    Background  = new _Background(Image_Path+"tela_01.jpg", 1920, 1200);

    //Assets
    fpsLabel    = new createjs.Text("-- fps", "bold 18px Arial", "#FFFFFF");
    level_label = new createjs.Text(GameState.level, "20px Arial", "#ffffff");
    setPos(level_label, Canvas.width-100, 10);
    alive_label = new createjs.Text(GameState.aliveEnemies, "16px Arial", "#ffffff");
    setPos(alive_label, Canvas.width-100, 50);

    //Structures
    Player = new _Player();

    setPos(Player.obj, Canvas.width/2, Canvas.height/2);
    setPos(Player.sign, Canvas.width/2+5, Canvas.height/2+43);
    setPos(fpsLabel, 10, 20);

    //Objects added example
    Stage.addChild(Background.obj);
    Stage.addChild(Player.sign);
    //Stage.addChild(Player.horizontal_weapon);
    //Stage.addChild(Player.vertical_weapon);
    Stage.addChild(Player.weapon);
    Stage.addChild(alive_label);
    Stage.addChild(level_label);
    Stage.addChild(Player.obj);
    Stage.addChild(Player.crown);
    Stage.addChild(fpsLabel);


    setInterval(function(){
        if (GameState.leader == User.id && GameState.aliveEnemies > 0)
            socket.emit("sbroadcast", GameState);
            
    }, 100);

    setInterval(function(){
        if (Key.isDown(Key.RIGHT) || Key.isDown(Key.LEFT) || Key.isDown(Key.UP) || Key.isDown(Key.DOWN))
            socket.emit("update_coords", User);
    }, 25);

    if (!createjs.Ticker.hasEventListener("tick")) { 
        createjs.Ticker.addEventListener("tick", gameLoop);
    }
    createjs.Ticker.setFPS(30);

    //Clean user positons
    setInterval(function(){
        for(var k in lstFriends)
        {
            if (typeof Users[k] == 'undefined')
            {
                Stage.removeChild(lstFriends[k].obj);
                delete lstFriends[k];
            }
        }
    }, 5000);


}
var new_game = false;
function gameLoop()
{
    //FPS label
    fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
    level_label.text = "Level: " + GameState.level;
    alive_label.text = "Alive: " + GameState.aliveEnemies;

    if (GameState.aliveEnemies == 0 && GameState.leader == User.id && new_game == false)
    {
        socket.emit("new_level", User);
        new_game = true;
    }
        

    if (GameState.enemies.length != EnemiesList.length)
        createEnemyList();
    
    //Update users' positions
    for(var key in Users)
    {
        var user_key = {x: Users[key].x * Canvas.width, y: Users[key].y * Canvas.height};
        if (typeof lstFriends[key] == 'undefined') {
            lstFriends[key] = new _Player();
            Stage.addChild(lstFriends[key].obj);
        }
        setPos(lstFriends[key].obj, user_key.x, user_key.y);
    }    

    for (var i = 0; i < EnemiesList.length; i++)
    {
        if (EnemiesList[i] != null) {

            if (GameState.enemies[i].life <= 0)
            {
                Stage.removeChild(EnemiesList[i].obj);
                EnemiesList[i] = null;
            }
            if (GameState.leader == User.id)
            {
                EnemiesList[i].update();
                setPos(GameState.enemies[i], EnemiesList[i].obj.x/Canvas.width, EnemiesList[i].obj.y/Canvas.height);   
            }
            else //If it is a regular player, update the snake positions
            {
                setPos(EnemiesList[i].obj, GameState.enemies[i].x*Canvas.width, GameState.enemies[i].y*Canvas.height);
            }
        }
    }
    Player.update();
    if (GameState.leader == User.id)
        setPos(GameState.crownPosition, Player.crown.x/Canvas.width, Player.crown.y/Canvas.height);
    else
        setPos(Player.crown, GameState.crownPosition.x*Canvas.width, GameState.crownPosition.y*Canvas.height);
    Stage.update();
}


//CHECK
function gameOver()
{return;
    //Stage.removeAllChildren();
    //Background  = new _Background(Image_Path+"tela_01.jpg", 1920, 1200);
    gameover_label = new createjs.Text("GAME OVER", "20px Arial", "#ffffff");
    setPos(gameover_label, Canvas.width/2, Canvas.height/2);
    Stage.addChild(gameover_label);


    Stage.removeAllChildren();
    EnemiesList = [];
    socket.emit("game_over", User);
    init();

}

function createEnemyList()
{   EnemiesList = [];
    for (var i=0; i< GameState.enemies.length; i++)
    {   EnemiesList.push(new _Enemy(GameState.enemies[i].speed));

        setPos( EnemiesList[i].obj,
                GameState.enemies[i].x,
                GameState.enemies[i].y
        );
        Stage.addChild(EnemiesList[i].obj);
        //test enemy type
    }
}

function createLevel()
{   GameState.aliveEnemies = Math.floor((2 * Math.pow(GameState.level, 1.5)) + 5);
    for (var i=0; i< GameState.aliveEnemies; i++)
    {   
        var direction = randomInt(0, 4);
        if (direction == 0)
        {
            range = {
                x: randomInt(Canvas.width, Canvas.width*2),
                y: randomInt(0, Canvas.height)
            }
        }
        else if (direction == 1){
            range = {
                x: randomInt(0, Canvas.width),
                y: randomInt(0, -Canvas.height*2)
            }
        }
        else if (direction == 2){
            range = {
                x: randomInt(-Canvas.width*2, 0),
                y: randomInt(0, Canvas.height)
            }
        }
        else{
            range = {
                x: randomInt(0, Canvas.width),
                y: randomInt(Canvas.height, Canvas.height*2)
            }
        }
        GameState.enemies.push({x: range.x,
                                y: range.y,
                                life: 100,
                                speed: randomInt(1, 3),
                                type: 'user_enemy'});
    }
}
