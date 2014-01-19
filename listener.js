function listen()
{
    var socket = io.connect('/');

    //Receives the broadcast messages
    socket.on('bcast', function (data) {
        gnotify(data.message, data.type);
    });

    //Update the online players counter
    socket.on('online', function (data) {
        $("#online").html("Online: " + data.online);
    });

}

