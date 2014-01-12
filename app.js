var port = 5000;
var http = require('http');
var url = require('url');
var fsys = require('fs');

function loadView(viewName) {
    try {
        return fsys.readFileSync("views"+viewName)
    } catch (e) {
        if (e.code === 'ENOENT') 
            return "<h1>404. File not found";
        else
            return "ABORT ABORT ABORT";
    }
}

function loadHtml(request, response, path)
{
    response.writeHead(200, {
        "Content-type": 'text/html; charset=utf-8'
    });
    response.write("Path: " + path + "<br>");
    response.end(loadView(path));
}

function game (request, response) {
    response.writeHead(200, {
        "Content-type": 'text/html; charset=utf-8'
    });
    response.end("This is the game screen");
}

var server = http.createServer(function (request, response) {
    var regex = new RegExp("^/game/?$");
    var curr_path = url.parse(request.url).pathname;
    if (regex.test(curr_path)) {
        game(request, response);
    } else {
        loadHtml(request, response, curr_path);
    }
})

server.listen(process.env.PORT || port);
console.log("> Server is running.");