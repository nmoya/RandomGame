var socket = null;

function listen()
{
    socket = io.connect('/');

    //Receives the broadcast messages
    socket.on('bcast', function (data) {
        gnotify(data.message, data.type);
    });

    //Update the online players counter
    socket.on('online', function (data) {
        $("#online").html("Online: " + data.online);
    });

    socket.on("connect", function(){
        Player = new _Player(socket.socket.sessionid);
    });

    //Set the game state to only one user.
    socket.on("setGameState", function (gs) {
        GameState = gs;
        delete GameState.Users[Player.id];
    });

    socket.on("user_disconnected", function (user_id) {
        Stage.removeChild(UserList[user_id].obj);
        last_user_removed = user_id;
        delete UserList[user_id];
    });

    socket.on("reset", function()
    {   
        for (var en in EnemiesList)
        {   
            if(EnemiesList[en] != null)
            {   
                Stage.removeChild(EnemiesList[en].obj);
                EnemiesList[en] = null;
            }
        }
        for (var b in BLOOD)
            Stage.removeChild(BLOOD[b].obj);
        BLOOD = [];
        EnemiesList = {};
    });

    socket.on("insert_blood", function(pos){
        var b = new _Blood()
        BLOOD.push(b);
        setPos(b.obj, pos.x, pos.y);
        Stage.addChildAt(b.obj, b.index);
    })

    socket.on("send_message", function(data){
         placeMessage(data.x, data.y, data.message, data.timeout);
    })
    
    setInterval(function(){
        socket.emit("ping_receive", GameState.time);
    }, 1000);

    socket.on("send_latency", function(latency){
        latencyLabel.text = Math.floor(latency/2) + " ms";
    })

}


