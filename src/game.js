//Assets

var background   = null;
var messageField = null;
var loading_length = 330;
var loading_rect = null;

var level_label = null;
var alive_label = null;
var new_game = false;
var music = false;
var message_label = null;
var placed = false;

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
        snotify(0.15, 0.25, "You MUST protect the leader", "info");
    }, 1000);
    setTimeout(function(){
        snotify(0.5, 0.7, "Use the ARROW keys to move around and SPACE to attack!", "info");
    }, 5000);

    //Creditos
    setTimeout(function(){
        gnotify("Nikolas Moya, programador.", "success");
    }, 20000);
    setTimeout(function(){
        gnotify("Guilherme Mattioli, programador", "success");
    }, 24000);
    setTimeout(function(){
        gnotify("Marilia Ferreira, designer.", "success");
    }, 28000);
    setTimeout(function(){
        gnotify("Rafael Zilio, designer", "success");
    }, 32000);
    setTimeout(function(){
        gnotify("Alex Campos, músico", "success");
    }, 36000);


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
    socket.emit("client_ready");
    if (music == false)
    {
        //createjs.Sound.play("bg_music", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.4);    
        music = true;
    }
    Background  = new _Background(Image_Path+"tela_01.jpg", 1920, 1200);

    //Assets
    latencyLabel    = new createjs.Text("-- fps", "bold 18px Arial", "#FFFFFF");
    level_label = new createjs.Text(GameState.level, "20px Arial", "#ffffff");
    setPos(level_label, Canvas.width-100, 10);
    alive_label = new createjs.Text(GameState.aliveEnemies, "16px Arial", "#ffffff");
    setPos(alive_label, Canvas.width-100, 50);
    message_label = new createjs.Text("", "48px Arial", "#ffffff");
    message_label.textAlign = "center";

    setPos(Player.obj, Canvas.width/2, Canvas.height/2);
    setPos(Player.sign, Canvas.width/2+5, Canvas.height/2+43);
    setPos(latencyLabel, 10, 20);

    //Objects added example
    Stage.addChild(Background.obj);
    Stage.addChild(Player.sign);
    Stage.addChild(Player.weapon);
    //Stage.addChild(alive_label);
    Stage.addChild(level_label);
    Stage.addChild(Player.obj);
    Stage.addChild(Player.crown);
    Stage.addChild(latencyLabel);
    Stage.addChild(message_label);

    if (!createjs.Ticker.hasEventListener("tick")) { 
        createjs.Ticker.addEventListener("tick", gameLoop);
    }
    createjs.Ticker.setFPS(30);

}

function gameLoop()
{
    //FPS label
    //latencyLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
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
        if (enemy.life <= 0)
            Stage.removeChild(EnemiesList[key].obj);
        else
        {
            if (!Stage.contains(EnemiesList[key].obj))
                Stage.addChild(EnemiesList[key].obj);
            setPos(EnemiesList[key].obj, enemy.x, enemy.y);
            EnemiesList[key].obj.gotoAndPlay(enemy.current_animation);
        }
    }
    if (GameState.crown_position)
        setPos(Player.crown, GameState.crown_position.x, GameState.crown_position.y);

    for (var i in particles)
        particles[i].update();
    
    Player.update();
    Stage.update();
}

function placeMessage(x, y, message, timeout){
    setPos(message_label, x*Canvas.width, y*Canvas.height);
    message_label.text = message;
    setTimeout(function(){
        message_label.Text = "";
        setPos(message_label, -999, -999);
    }, timeout);
    
}

