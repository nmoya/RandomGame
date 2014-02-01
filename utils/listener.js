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
        EnemiesList = {};
    });

    socket.on("insert_blood", function(pos){
        if (!BLOOD)
            BLOOD = new _Blood();
        setPos(BLOOD.obj, pos.x, pos.y);
        Stage.addChildAt(BLOOD.obj, BLOOD.index);
        BLOOD.index+=1;
    })

    socket.on("send_message", function(data){
         placeMessage(data.x, data.y, data.message);
    })

}


