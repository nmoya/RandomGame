var port = 5000;

var http = require('http');
var server = http.createServer(function (request, response) {
    response.writeHead(200, {
        "Content-type": 'text/html; charset=utf-8'
    });
    response.end("Hello world");
})

server.listen(process.env.PORT || port);
console.log("> Server is running.");