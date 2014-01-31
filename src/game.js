//Assets
var fpsLabel     = '';
var background   = null;
var messageField = null;
var loading_length = 330;
var loading_rect = null;

var level_label = null;
var alive_label = null;
var gameover_label = null;
var new_game = false;
var music = false;

function main(GameState) 
{
    if (!createjs.Sound.initializeDefaultPlugins()) {
        alert("Cannot initializeDefaultPlugins");
        return;
    }

    //Major Structures
    Canvas      = new _Canvas($("#mainCanvas")[0]);
    Mouse       = new _Mouse();
    Stage       = new createjs.Stage("mainCanvas");
    Background  = new _Background(Image_Path+"loading.jpg", 1806, 1148);    

    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    loading_rect = new createjs.Shape();
    loading_rect.graphics.beginFill("#7ba800").drawRect(Canvas.width / 2-(loading_length/2)+50, Canvas.height*0.77, 10, 35);
    Stage.addChild(Background.obj);
    Stage.addChild(loading_rect);
    Stage.update();

    var manifest = [
        {id:"loading", src:Image_Path+"loading.jpg"},
        {id:"tela_01.png", src:Image_Path+"tela_01.jpg"},
        {id:"crown.png", src:Image_Path+"crown.png"},
        {id:"keyboard.png", src:Image_Path+"keyboard.png"},
        {id:"blood.png", src:Image_Path+"blood.png"},
        {id:"programmer.png", src:Image_Path+"programmer.png"},
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

    //Creditos
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
    setTimeout(function(){
        gnotify("Alex Campos, músico", "success");
    }, 28000);


    preload = new createjs.LoadQueue();
    preload.installPlugin(createjs.Sound);
    preload.addEventListener("complete", init);
    preload.addEventListener("progress", updateLoading);
    preload.loadManifest(manifest);

}
function updateLoading()
{
    loading_rect.graphics.beginFill("#7ba800").drawRect(Canvas.width / 2-(loading_length/2)+50, Canvas.height*0.77, loading_length*(preload.progress*100|0)/100, 35);
    Stage.update();
}

function init()
{
    Stage.removeAllChildren();
    if (music == false)
    {
        //createjs.Sound.play("bg_music", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.4);    
        music = true;
    }
    Background  = new _Background(Image_Path+"tela_01.jpg", 1920, 1200);

    //Assets
    fpsLabel    = new createjs.Text("-- fps", "bold 18px Arial", "#FFFFFF");
    level_label = new createjs.Text(GameState.level, "20px Arial", "#ffffff");
    setPos(level_label, Canvas.width-100, 10);
    alive_label = new createjs.Text(GameState.aliveEnemies, "16px Arial", "#ffffff");
    setPos(alive_label, Canvas.width-100, 50);


    setPos(Player.obj, Canvas.width/2, Canvas.height/2);
    setPos(Player.sign, Canvas.width/2+5, Canvas.height/2+43);
    setPos(fpsLabel, 10, 20);

    //Objects added example
    Stage.addChild(Background.obj);
    Stage.addChild(Player.sign);
    Stage.addChild(Player.weapon);
    Stage.addChild(alive_label);
    Stage.addChild(level_label);
    Stage.addChild(Player.obj);
    Stage.addChild(Player.crown);
    Stage.addChild(fpsLabel);

    /*setInterval(function ()
    {   if(GameState.leader == User.id)
        {   var nullEnemies = true;
            for (var i = EnemiesList.length - 1; i >= 0; i--)
            {   nullEnemies = nullEnemies && (EnemiesList[i] == null);
            }
            if(nullEnemies && EnemiesList.length > 0 && new_game == false)
            {   GameState.aliveEnemies = 0;
                socket.emit("new_level", User);
                new_game = true;
            }
            if (GameState.level == 0 && new_game == false)
            {
                GameState.aliveEnemies = 0;
                socket.emit("new_level", User);
                new_game = true;
            }
        }
    }, 1000);*/

    setInterval(function ()
    {   
        new_game = false;
    }, 10000);

    setInterval(function(){
        if (Key.isDown(Key.RIGHT) || Key.isDown(Key.LEFT) || Key.isDown(Key.UP) || Key.isDown(Key.DOWN))
            socket.emit("update_coords", {id: Player.id, 
                                          x: Player.obj.x,
                                          y: Player.obj.y,
                                          current_animation: Player.obj.currentAnimation});
    }, 25);

    if (!createjs.Ticker.hasEventListener("tick")) { 
        createjs.Ticker.addEventListener("tick", gameLoop);
    }
    createjs.Ticker.setFPS(30);

}

function gameLoop()
{
    //FPS label
    fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
    level_label.text = "Level: " + GameState.level;
    alive_label.text = "Alive: " + GameState.aliveEnemies;
    
    //Update users' positions
    for(var key in GameState.Users)
    {
        if (key != last_user_removed)
        {
            var temp_user = GameState.Users[key];
            if (typeof UserList[key] == 'undefined') {
                UserList[key] = new _Player(0);
                Stage.addChild(UserList[key].obj);
                console.log("Adding user of id: " + key);
            }
            setPos(UserList[key].obj, temp_user.x, temp_user.y);
            if (UserList[key].obj.currentAnimation != temp_user.current_animation)
                UserList[key].obj.gotoAndPlay(temp_user.current_animation);
        }
    }
    //Update enemies' positions
    for(var key in GameState.Enemies)
    {
        var enemy = GameState.Enemies[key];
        if (typeof EnemiesList[key] == 'undefined') 
        {
            EnemiesList[key] = new _Enemy(enemy.speed);
            Stage.addChild(EnemiesList[key].obj);
        }
        setPos(EnemiesList[key].obj, enemy.x, enemy.y);
        EnemiesList[key].obj.gotoAndPlay(enemy.current_animation);
    }   

    Player.update();
    Stage.update();
}


//CHECK
function gameOver()
{
    //Stage.removeAllChildren();
    //Background  = new _Background(Image_Path+"tela_01.jpg", 1920, 1200);
    gameover_label = new createjs.Text("GAME OVER", "20px Arial", "#ffffff");
    setPos(gameover_label, Canvas.width/2, Canvas.height/2);
    Stage.addChild(gameover_label);


    Stage.removeAllChildren();
    UserList = {};
    EnemiesList = [];
    socket.emit("game_over", User);
    gnotify("GAME OVER", "error");
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

