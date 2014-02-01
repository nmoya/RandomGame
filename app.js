var port = process.env.PORT || 5000;
var express = require('express');
var http = require('http');
var app = express();
var io = require('socket.io');
var fs = require("fs");
var emitter = require('events');
var serv_io = null;
var clients = 0;

var serverinterval = null;
var CONFIG = {};
var socket_list = {};
var user_array = {};
var GameState = {
    uid: 0,
    config: {},
    leader: false,
    Enemies: {},
    Users: {},
    level: 0,
    aliveEnemies: 0,
    crown_position: { x: 0, y: 0}
}
var user_id = 0;


//Require other files 
//http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files

//Road map
init();
treatRequests();
socket_functions();

//Creates the HTTP server and configurates the libraries
function init()
{
    emitter = new emitter.EventEmitter();
    console.log(emitter);
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.static(__dirname + '/public'));

    /* Create server */
    server = http.createServer(app)
    server.listen(port, function () {
        console.log("SERVER RUNNING. Port: " + port);
    });
    serv_io = io.listen(server);
    serv_io.set("log level", 1);
    //http://stackoverflow.com/questions/8801014/socket-io-xhr-polling-vs-flashsocket-and-websocket
    //https://blog.heroku.com/archives/2013/10/8/websockets-public-beta
    serv_io.set('transports', [
            'websocket'
          //,'flashsocket'
          //, 'htmlfile'
          , 'xhr-polling'
          //, 'jsonp-polling'
        ]);
    serv_io.set("polling duration", 3);
    serv_io.set("connect timeout", 10);

    fs.readFile("config.json", 'utf8', function (err, data) {
      if (err) {console.log('Error: ' + err);
                return;}
 
    CONFIG = JSON.parse(data);
    console.dir(CONFIG);
    });
}

//Treat all GET and POST requests to the server
function treatRequests()
{
    //Main Page
    app.get("/", function(req, res) {
       res.sendfile('index.html')
    });

    /* serves all the static files */
    app.get(/^(.+)$/, function(req, res){ 
        //console.log('static file request : ' + req.params);
        res.sendfile( __dirname + req.params[0]); 
    });

    app.post("/ggj/bcast", function(req, res) {
        console.log("Broadcasting: " + req.body.message);
        serv_io.sockets.emit('bcast', req.body);
        res.send("Broadcast: \"" + req.body.message + "\" sent!");
    });
}

//Responsible to send events to the client side.
function socket_functions()
{   //On connection. S is the file of a single player!!!

    serv_io.sockets.on("connection", function(s){ 
        //Update online players tag
        clients += 1;
        serv_io.sockets.emit("online", {online: clients});
        socket_list[s.id] = s;
        console.log("Online: " + clients);
        
        //If the client is alone, a new game needs to be created
        GameState.Users[s.id] = {x: 0, y: 0, current_animation: "idle"};

        s.on("client_ready", function(){
            if (clients == 1)
                createGameState(1);
        })

        s.on("update_coords", function(player){
            if (typeof GameState.Users[s.id] != 'undefined')
            {
                GameState.Users[s.id].x = player.x;
                GameState.Users[s.id].y = player.y;
                GameState.Users[s.id].current_animation = player.current_animation;

                if (s.id == GameState.leader)
                    GameState.crown_position = setCrownPosition(player);
                    
            }
        })

        s.on("send_hit", function(player){
            var hit_count = 0;
            for (var i in GameState.Enemies)
            {   
                if (GameState.Enemies[i].life > 0 && distance(GameState.Enemies[i], player) < 75)
                {   
                    GameState.Enemies[i].life -= player.damage;
                    GameState.aliveEnemies -= 1;
                    hit_count+=1;
                }
            }
        })

        s.on("disconnect", function(){
            //Updates the online tag
            clients -= 1;
            serv_io.sockets.emit("online", {online: clients});
            console.log("Online: " + clients);
            delete socket_list[s.id];

            delete GameState.Users[s.id];
            serv_io.sockets.emit("user_disconnected", s.id);

            if (clients == 0)
                destroyGameState();
            else if (s.id == GameState.leader)
            {
                GameState.leader = elect_leader();
                GameState.crown_position = setCrownPosition(GameState.Users[GameState.leader]);
            }
        })
    
    });
}
function createGameState(level){
    GameState.uid = 1;
    GameState.leader = elect_leader();
    GameState.level = level;
    GameState.aliveEnemies = Math.floor((2 * Math.pow(GameState.level, 1.5)) + 5);
    GameState.config = CONFIG;
    GameState.config.Player.leader_speed = GameState.config.Player.regular_speed;

    socket_list[GameState.leader].emit("send_message", {x: 0.5, y:0.5, message: "You are the leader!"});

    GameState.Enemies = {};
    for (var i=0; i< GameState.aliveEnemies; i++)
    {   
        var direction = randomInt(0, 4);
        if (direction == 0)
        {
            range = {
                x: randomInt(GameState.config.Game.spawn_position["0x"][0], GameState.config.Game.spawn_position["0x"][1]),
                y: randomInt(GameState.config.Game.spawn_position["0y"][0], GameState.config.Game.spawn_position["0y"][1])
            }
        }
        else if (direction == 1){
            range = {
                x: randomInt(GameState.config.Game.spawn_position["1x"][0], GameState.config.Game.spawn_position["1x"][1]),
                y: randomInt(GameState.config.Game.spawn_position["1y"][0], GameState.config.Game.spawn_position["1y"][1])
            }
        }
        else if (direction == 2){
            range = {
                x: randomInt(GameState.config.Game.spawn_position["2x"][0], GameState.config.Game.spawn_position["2x"][1]),
                y: randomInt(GameState.config.Game.spawn_position["2y"][0], GameState.config.Game.spawn_position["2y"][1])
            }
        }
        else{
            range = {
                x: randomInt(GameState.config.Game.spawn_position["3x"][0], GameState.config.Game.spawn_position["3x"][1]),
                y: randomInt(GameState.config.Game.spawn_position["3y"][0], GameState.config.Game.spawn_position["3y"][1])
            }
        }
        GameState.Enemies[i] = new ServerEnemy(range.x, range.y, 100,
                               randomInt(GameState.config.Enemy.min_speed, GameState.config.Enemy.max_speed),
                                'user_enemy', "idle");
    }
    GameState.crown_position = {x: 0, y: 0};
    serverinterval = setInterval(serverloop, 1000/GameState.config.Game.max_fps);
}
function ServerEnemy(x, y, life, speed, type, current_animation)
{
    this.x = x;
    this.y = y;
    this.life = life;
    this.speed = speed;
    this.type = type;
    this.current_animation = current_animation;

    this.update = function (){
        leader = getLeader();

        if (this.x < leader.x)
        {   this.x += this.speed;
            if (this.current_animation != "right")
                this.current_animation = "right";
        }
        else if (this.x > leader.x)
        {   this.x -= this.speed;
            if (this.current_animation != "left")
                this.current_animation = "left";
        }
        if (this.y < leader.y)
        {   this.y += this.speed;
            if (this.current_animation != "down")
                this.current_animation = "down";
        }
        else if (this.y > leader.y)
        {   this.y -= this.speed;
            if (this.current_animation != "up")
                this.current_animation = "up";
        }

        if (this.life > 0 && distance(this, leader) < GameState.config.Enemy.attack_radius)
        {
            serv_io.sockets.emit("insert_blood", {x: leader.x, y: leader.y});
            GameState.aliveEnemies -= 1;
            this.life = 0;
            GameState.config.Player.leader_speed = Math.floor(GameState.config.Player.leader_speed / 2);
            if (GameState.config.Player.leader_speed == 0)
                GameOver();
        }
            

    }

}

function destroyGameState(){
    clearInterval(serverinterval);
    GameState = {};
    GameState.Users = {};
    GameState.config = CONFIG;
    GameState.Enemies = {};
}
function GameOver(callback) {
    clearInterval(serverinterval);
    serv_io.sockets.emit("reset");
    serv_io.sockets.emit("send_message", {x: 0.5, y: 0.5, message: "GAME OVER! The leader died."});
    setTimeout(function(){
        createGameState(1);
    }, 3000);
}
function NextLevel(){
    clearInterval(serverinterval);
    serv_io.sockets.emit("reset");
    serv_io.sockets.emit("send_message", {x: 0.5, y: 0.5, message: "Level Complete"});
    setTimeout(function(){
        createGameState(GameState.level+1);
    }, 3000);
}
function serverloop()
{
    console.log("Game loop");
    for(var key in GameState.Enemies)
        if (GameState.Enemies[key])
            GameState.Enemies[key].update();

    if (GameState.aliveEnemies == 0)
        NextLevel();
    
    GameState.uid += 1;
    serv_io.sockets.emit('setGameState', GameState);
}
function setCrownPosition(user)
{
    return {x: user.x + GameState.config.Game.crown_offset[0],
            y: user.y + GameState.config.Game.crown_offset[1]};
}
function getLeader()
{
    return GameState.Users[GameState.leader];
}
function elect_leader()
{
    var user_list = []
    for(var k in GameState.Users)
        user_list.push(k);
    return user_list[randomInt(0, user_list.length-1)];
}
function randomInt(min, max)
{
    return Math.round(min + Math.random()*(max-min));
}
function distance(object1, object2)
{
    return Math.sqrt( (object1.x-object2.x)*(object1.x-object2.x) + (object1.y-object2.y)*(object1.y-object2.y));
}