var port = process.env.PORT || 5000;
var express = require('express');
var http = require('http');
var app = express();
var io = require('socket.io');
var fs = require("fs");
var serv_io = null;
var clients = 0;


var serverinterval = null;
var CONFIG = {};
var socket_list = {};
var user_array = {};
var GameState = {
    uid: 0,
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
    //app.use(express.bodyParser());
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
    serv_io.set('transports', [
            'websocket'
          , 'flashsocket'
          , 'htmlfile'
          , 'xhr-polling'
          , 'jsonp-polling'
        ]);
    serv_io.set("polling duration", 3);
    serv_io.set("connect timeout", 1000);

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
        if (clients == 1)
            createGameState(s);
        else
            GameState.Users[s.id] = {x: 0, y: 0, current_animation: "idle"};

        s.on("update_coords", function(user){
            if (typeof GameState.Users[s.id] != 'undefined')
            {
                GameState.Users[s.id].x = user.x;
                GameState.Users[s.id].y = user.y;
                GameState.Users[s.id].current_animation = user.current_animation;

                if (s.id == GameState.leader)
                    GameState.crown_position = {x: user.x+CONFIG.Game.crown_offset[0], y: user.y+CONFIG.Game.crown_offset[1]};
                    
            }
        })

        s.on("new_level", function(user)
        {   serv_io.sockets.emit("reset");
            GameState.leader = elect_leader();
            GameState.Enemies = [];
            GameState.aliveEnemies = -1;
            GameState.level += 1;
            serv_io.sockets.emit("cbroadcast", GameState);
        })

        s.on("game_over", function(user){
            serv_io.sockets.emit("reset");
            GameState.leader = elect_leader();
            GameState.Enemies = [];
            GameState.aliveEnemies = -1;
            GameState.level = 1;
            serv_io.sockets.emit("cbroadcast", GameState);
        })

        //send the hit to lider
        s.on("send_hit", function(hit)
        {   socket_list[GameState.leader].emit("lider_hit", hit);
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
                GameState.crown_position = {x: GameState.Users[GameState.leader].x+CONFIG.Game.crown_offset[0],
                                          y: GameState.Users[GameState.leader].y+CONFIG.Game.crown_offset[1]};
            }
        })

        s.on("sbroadcast", function(data){
            serv_io.sockets.emit("cbroadcast", data);
        });

    
    });
}
function createGameState(s){
    GameState.uid = 1;
    GameState.Users[s.id] = {x: 0, y: 0, current_animation: "idle"};
    GameState.leader = elect_leader();
    GameState.level = 1;
    GameState.aliveEnemies = Math.floor((2 * Math.pow(GameState.level, 1.5)) + 5);

    for (var i=0; i< GameState.aliveEnemies; i++)
    {   
        var direction = randomInt(0, 4);
        if (direction == 0)
        {
            range = {
                x: randomInt(CONFIG.Game.spawn_position["0x"][0], CONFIG.Game.spawn_position["0x"][1]),
                y: randomInt(CONFIG.Game.spawn_position["0y"][0], CONFIG.Game.spawn_position["0y"][1])
            }
        }
        else if (direction == 1){
            range = {
                x: randomInt(CONFIG.Game.spawn_position["1x"][0], CONFIG.Game.spawn_position["1x"][1]),
                y: randomInt(CONFIG.Game.spawn_position["1y"][0], CONFIG.Game.spawn_position["1y"][1])
            }
        }
        else if (direction == 2){
            range = {
                x: randomInt(CONFIG.Game.spawn_position["2x"][0], CONFIG.Game.spawn_position["2x"][1]),
                y: randomInt(CONFIG.Game.spawn_position["2y"][0], CONFIG.Game.spawn_position["2y"][1])
            }
        }
        else{
            range = {
                x: randomInt(CONFIG.Game.spawn_position["3x"][0], CONFIG.Game.spawn_position["3x"][1]),
                y: randomInt(CONFIG.Game.spawn_position["3y"][0], CONFIG.Game.spawn_position["3y"][1])
            }
        }
        GameState.Enemies[i] = {x: range.x,
                               y: range.y,
                               life: 100,
                               speed: randomInt(CONFIG.Enemy.min_speed, CONFIG.Enemy.max_speed),
                               type: 'user_enemy',
                               current_animation: "idle"
                           };
    }
    GameState.crown_position = {x: 0, y: 0};
    serverinterval = setInterval(serverloop, 1000/CONFIG.Game.max_fps);
}
function destroyGameState(){
    GameState = {};
    GameState.Users = {};
    GameState.Enemies = {};
    clearInterval(serverinterval);
}
function serverloop()
{
    serv_io.sockets.emit('setGameState', GameState);
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