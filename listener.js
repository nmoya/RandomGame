var socket = null;
var Players = {};
var User = null;

function listen()
{
    socket = io.connect('/');
    User = {
        id: 0,
        x: 0,
        y: 0,
    }

    //Receives the broadcast messages
    socket.on('bcast', function (data) {
        gnotify(data.message, data.type);
    });

    //Update the online players counter
    socket.on('online', function (data) {
        $("#online").html("Online: " + data.online);
    });


    socket.on("connect", function(){
        User.id = socket.socket.sessionid;
        socket.emit("mouse_connected", User);
    });

    socket.on("send_data", function(list){
        Players = list;
        delete Players[User.id];
    });


}


