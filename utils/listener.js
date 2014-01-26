var socket = null;
var Users = {};
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
        socket.emit("user_connected", User);
        //Just to make sure that the clients number is accurate.
        socket.emit("getGameState");
    });

    //Users walk
    socket.on("send_data", function(list){
        Users = list;
        delete Users[User.id];
    });

    //Set the game state to only one user.
    socket.on("setGameState", function (gs) {
        GameState = gs;
    });

    //Set the life of enemy has hited by other user
    socket.on("lider_hit", function (hit)
    {   GameState.enemies[hit.pos].life -= hit.life;
    });

    //Set the game state via broadcast. (All users)
    socket.on("cbroadcast", function(data)
    {   GameState = data;
        if (GameState.leader == User.id && GameState.aliveEnemies == -1)
        {   gnotify("You have been elected as the leader!", "success");
            createLevel();
            socket.emit("sbroadcast", GameState);
        }
        /*if (GameState.aliveEnemies > 0 && EnemiesList.length == 0)
        {   
            console.log("here");
            f = function (){
                if (GameScreen)
                {
                    if (EnemiesList.length == 0)
                        createEnemyList();
                }
                    
                else
                    setTimeout(f, 100);
            }
            f();
        }*/

        // Test if have a level change (in this case: EnemiesList != 0)
        
    });


}


