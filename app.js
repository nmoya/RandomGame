var port = process.env.PORT || 5000;
var express = require('express');
var http = require('http');
var app = express();
var io = require('socket.io');

var serv_io = null;
var clients = 0;


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

    /*app.configure(function(){
        app.use('/images', express.static(path.join(__dirname, '/images')));
        app.use('/lib', express.static(path.join(__dirname, '/lib')));
        app.use('/views', express.static(path.join(__dirname, '/views')));
    });*/

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
        console.log('static file request : ' + req.params);
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
{
    serv_io.sockets.on("connection", function(s){ 
        clients += 1;
        serv_io.sockets.emit("online", {online: clients});
        console.log("Online: " + clients);
        if (clients == 2)
            serv_io.sockets.emit("bcast", {type: "info", message: "One more player for DOUBLE points!"});
        s.on("disconnect", function(){
            clients -= 1;
            //Consider commenting the line below for performance
            serv_io.sockets.emit("online", {online: clients});
            console.log("Online: " + clients);
       });
    });
}


