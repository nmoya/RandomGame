var port = process.env.PORT || 5000;
var express = require('express');
var http = require('http');
var app = express();
var io = require('socket.io');

var connectionCounter = 0;
var serv_io = null;

init();

app.post("/ggj/bcast", function(req, res) {
    console.log("Broadcasting: " + req.body.message);
    serv_io.sockets.emit('bcast', req.body);
    res.send("Broadcast: \"" + req.body.message + "\" sent!");
});

serv_io.sockets.on('connection', function (socket) { 
    connectionCounter += 1;
    console.log("Online: " + connectionCounter);
    socket.emit("bcast", {type: "success", message: "Online: " + connectionCounter});
    //socket.emit("bcast", {type: "info", message: "it works!"});
})
serv_io.sockets.on('disconnect', function (socket) { 
    connectionCounter -= 1;
    console.log("Online: " + connectionCounter);
})

/*app.configure(function(){
    app.use('/images', express.static(path.join(__dirname, '/images')));
    app.use('/lib', express.static(path.join(__dirname, '/lib')));
    app.use('/views', express.static(path.join(__dirname, '/views')));
});*/



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

    //Main Page
    app.get("/", function(req, res) {
       res.sendfile('index.html')
    });

    /* serves all the static files */
    app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
});
   
}
 



