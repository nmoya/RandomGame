var port = process.env.PORT || 5000;
var http = require('http');
var url = require('url');
var express = require('express');
var app = express();

//app.use(express.logger());
app.use(express.static(__dirname + '/public'));

/* serves main page */
app.get("/", function(req, res) {
   res.sendfile('index.html')
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){ 
 console.log('static file request : ' + req.params);
 res.sendfile( __dirname + req.params[0]); 
});

//app.post("/user/add", function(req, res) { 
/* some server side logic */
//res.send("OK");
//});
 

http.createServer(app).listen(port, function () {
    console.log("SERVER RUNNING. Port: " + port);
});


/*app.configure(function(){
    app.use('/images', express.static(path.join(__dirname, '/images')));
    app.use('/lib', express.static(path.join(__dirname, '/lib')));
    app.use('/views', express.static(path.join(__dirname, '/views')));
});*/




 



