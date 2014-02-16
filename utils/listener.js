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
        Player = new _Player(socket.socket.sessionid, null);
    });

    //Set the game state to only one user.
    socket.on("setGameState", function (gs) {
        GameState = gs;
        delete GameState.Users[Player.id];
    });

    socket.on("ChangeName", function(oldname, newname, sid){
        if (Player.id == sid)
            Player.name = newname;            
        StageObjects.changeName(oldname, newname);
    })

    socket.on("UserDisconnected", function (user_id) {
        if (typeof UserList[user_id] != "undefined")
        {
            Stage.removeChild(UserList[user_id].obj);
            last_user_removed = user_id;
            StageObjects.removeName(UserList[user_id].name);
            delete UserList[user_id];
        }
    });

    socket.on("MessageReceived", function (message) {
        $(".text-history").val($(".text-history").val() + "\n" + message);
        $(".text-history").stop();
        $(".text-history").show(0, function(){
            $('.text-history').scrollTop($('.text-history')[0].scrollHeight);
        });
        setTimeout(function(){
            if (!Text_input)
                $(".text-history").hide(1000);
        }, 2000);
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
        StageObjects.cleanBloodList();
        EnemiesList = {};
    });

    socket.on("LeaderHit", function(pos){
        if (StageObjects)
            StageObjects.addBlood(pos);
    })

    socket.on("StageMessage", function(data){
         placeMessage(data.x, data.y, data.message, data.timeout);
    })

    setInterval(function(){
        latency_time = Date.now();
        socket.emit("PingMeasurement");
    }, 2500);
    socket.on("PingReply", function(){
        latency_time = Date.now() - latency_time;
        latencyLabel.text = Math.floor(latency_time) + " ms";  
    })
    
}


