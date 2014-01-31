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
        console.log("Meu id:" + Player.id);
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

    //Set the life of enemy has hited by other user
    socket.on("lider_hit", function (hit)
    {   if(GameState.enemies[hit.pos].life > 0)
        {   GameState.enemies[hit.pos].life -= hit.life;
            if (GameState.enemies[hit.pos].life <= 0)
            {   GameState.aliveEnemies --;
            }
        }

        if(GameState.aliveEnemies <= 0)
        {   socket.emit("new_level", User);
        }
    });

    socket.on("reset", function()
    {   for (var i = EnemiesList.length - 1; i >= 0; i--)
        {   if(EnemiesList[i] != null)
            {   Stage.removeChild(EnemiesList[i].obj);
                EnemiesList[i] = null;
            }
        }
        EnemiesList = [];
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


