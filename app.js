var port = process.env.PORT || 3000;
var express = require('express');
var http = require('http');
var io = require('socket.io');
var GS = require('./server/gameserver.js');
var app = express();
clients = 0;
serv_io = null;


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

    GS.loadConfigFile();
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
function serverListener()
{   //On connection. S is the file of a single player!!!

    serv_io.sockets.on("connection", function(s){ 
        //Update online players tag
        //serv_io.sockets.emit("online", {online: clients});
        clients += 1;
        //socket_list[s.id] = s;
        console.log("Online: " + clients);
        if (port != 3000)   //Only send email on heroku
            http.get('http://nikolasmoya.com/ws/wsGameNotify', function(){console.log("Email sent");});
        
        //If the client is alone, a new game needs to be created
        GS.createUser(s.id, s);
        if (clients == 1)
            GS.createGameState(1);

        s.on("update_coords", function(user){
            GS.updateUserCoords(s.id, user);
        })

        s.on("send_hit", function(user){
            GS.processUserAttack(user);
        })

        s.on("MessageSentByUser", function(message){
            GS.processMessage(s.id, message);
        })

        s.on("disconnect", function(){
            //Updates the online tag
            //serv_io.sockets.emit("online", {online: clients});

            clients -= 1;
            console.log("Online: " + clients);
            //delete socket_list[s.id];
            GS.destroyUser(s.id);
            if (clients == 0)
                GS.destroyGameState();

        })

        s.on("PingMeasurement", function(){
            s.emit("PingReply");
        })
    
    });
}

init();
treatRequests();
serverListener();
