var port = process.env.PORT || 5000;
var express = require('express');
var http = require('http');
var app = express();
var io = require('socket.io');

var serv_io = null;
var clients = 0;

socket_list = {};
user_array = {};
var cleanGameState = {
    leader: false,
    enemies: [],
    level: 0,
    aliveEnemies: 0
};

var GameState = {
    leader: false,
    enemies: [],
    level: 0,
    aliveEnemies: 0,
    crownPosition: { x: 0, y: 0}
}


//Require other files 
//http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files

//Road map
init();
treatRequests();
socket_functions();

//Creates the HTTP server and configurates the libraries
function init()
{
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

        
        //When a user opens the website
        s.on("user_connected", function(user){
            user_array[user.id] = user;
            serv_io.sockets.emit("send_data", user_array);
        })

        s.on("getGameState", function(){
            if (clients == 1)
            {   GameState.leader = s.id;
                GameState.aliveEnemies = 0;
            }
            s.emit("setGameState", GameState);
        })

        s.on("update_coords", function(user){
            if (typeof user_array[s.id] != 'undefined')
            {
                user_array[s.id].x = user.x;
                user_array[s.id].y = user.y;
                serv_io.sockets.emit("send_data", user_array);
            }
        })

        s.on("new_level", function(user)
        {   serv_io.sockets.emit("reset");
            GameState.leader = elect_leader();
            GameState.enemies = [];
            GameState.aliveEnemies = -1;
            GameState.level += 1;
            serv_io.sockets.emit("cbroadcast", GameState);
        })

        s.on("game_over", function(user){
            serv_io.sockets.emit("reset");
            GameState.leader = elect_leader();
            GameState.enemies = [];
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
            delete user_array[s.id];
            delete socket_list[s.id];
            serv_io.sockets.emit("send_data", user_array);
            console.log("Online: " + clients);

            if (clients == 0)
            {
                GameState = {
                    leader: false,
                    enemies: [],
                    level: 0,
                    aliveEnemies: 0,
                    crownPosition: { x: 0, y: 0}
                }
            }
            else if (s.id == GameState.leader)
            {
                GameState.leader = elect_leader();
                serv_io.sockets.emit("cbroadcast", GameState);
            }
        })

        s.on("sbroadcast", function(data){
            serv_io.sockets.emit("cbroadcast", data);
        });

    
    });
}

function elect_leader()
{
    var user_list = []
    for(var k in user_array)
        user_list.push(k);
    return user_list[randomInt(0, user_list.length-1)];
}
function randomInt(min, max)
{
    return Math.round(min + Math.random()*(max-min));
}