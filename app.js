var port = process.env.PORT || 5000;
var express = require('express');
var http = require('http');
var app = express();
var io = require('socket.io');

var connectionCounter = 0;
var serv_io = null;

/* Create server */
server = http.createServer(app)
server.listen(port, function () {
    console.log("SERVER RUNNING. Port: " + port);
});
serv_io = io.listen(server);


//Main Page
app.get("/", function(req, res) {
   res.sendfile('index.html')
});

/* serves all the static files */
app.use(express.static(__dirname + '/public'));
app.get(/^(.+)$/, function(req, res){ 
 console.log('static file request : ' + req.params);
 res.sendfile( __dirname + req.params[0]); 
});
app.post("/ggj/bcast", function(req, res) {
    res.send("OK");
});

serv_io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

serv_io.sockets.on('connection', function (socket) { 
    connectionCounter += 1;
    console.log("Online: " + connectionCounter);
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




 



