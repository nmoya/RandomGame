var common = require("../common.js");
var fs = require("fs");

////////////////////////////////
//
//Private Variables
//
////////////////////////////////
var CONFIG = {};
var NAMES = [];
var GameState = {
    uid: 0,
    time: 0,
    config: {},
    leader: false,
    Enemies: {},
    Users: {},
    level: 0,
    aliveEnemies: 0,
    crown_position: { x: 0, y: 0}   //Set in loadConfigFile
}
var serverinterval = null;
var socket_list    = {};


////////////////////////////////
//
//Public functions
//
////////////////////////////////
module.exports = {
    GameState: GameState,
    loadConfigFile: function(){
        fs.readFile("./server/config.json", 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
           CONFIG = JSON.parse(data);
        });
        fs.readFile("./server/names.json", 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
           NAMES = JSON.parse(data);
        });
    },
    createUser: function(socket_id, socket) {
        GameState.Users[socket_id] = {x: CONFIG.Player.start_pos[0],
                                      y: CONFIG.Player.start_pos[1],
                                      current_animation: "idle",
                                      name: {text: randomName(), x: 0, y: 0}};
        setTimeout(function(){
            serv_io.sockets.emit("ChangeName", "", GameState.Users[socket_id].name, socket_id);
        }, 5000);
        socket_list[socket_id] = socket;
    },
    destroyUser: function(socket_id){
        delete GameState.Users[socket_id];
        delete socket_list[socket_id];
        serv_io.sockets.emit("UserDisconnected", socket_id);
        if (GameState.leader == socket_id && clients > 0)
        {
            GameState.leader = leader_election();
            GameState.crown_position = setCrownPosition(getLeader());
        }
    },
    updateUserCoords: function(socket_id, user) {
        if (typeof GameState.Users[socket_id] != 'undefined')
        {
            GameState.Users[socket_id].x = user.x;
            GameState.Users[socket_id].y = user.y;
            GameState.Users[socket_id].current_animation = user.current_animation;
            GameState.Users[socket_id].name.x = user.x + CONFIG.Items.names.offset[0];
            GameState.Users[socket_id].name.y = user.y + CONFIG.Items.names.offset[1];

            if (socket_id == GameState.leader)
                GameState.crown_position = setCrownPosition(user);
        }
    },
    processUserAttack: function(user){
        var hit_count = 0;


        for (var i in GameState.Enemies)
        {   
            if (GameState.Enemies[i].life > 0 && common.euclidean_distance(user, GameState.Enemies[i]) < 75)
            {   
                GameState.Enemies[i].life -= user.damage;
                GameState.aliveEnemies -= 1;
                hit_count+=1;
            }
        }
        if (GameState.aliveEnemies > 0)
        {
            if (hit_count == 2)
                serv_io.sockets.emit("StageMessage", {x: 0.8, y: 0.1, message: "DOUBLE KILL", timeout: 750});
            else if (hit_count == 3)
                serv_io.sockets.emit("StageMessage", {x: 0.8, y: 0.1, message: "TRIPLE KILL", timeout: 750});
            else if (hit_count == 4)
                serv_io.sockets.emit("StageMessage", {x: 0.8, y: 0.1, message: "QUADRA KILL", timeout: 750});
            else if (hit_count == 5)
                serv_io.sockets.emit("StageMessage", {x: 0.8, y: 0.1, message: "PENTA KILL", timeout: 750});
            else if (hit_count == 6)
                serv_io.sockets.emit("StageMessage", {x: 0.8, y: 0.1, message: "HEXA KILL", timeout: 750});
            else if (hit_count == 7)
                serv_io.sockets.emit("StageMessage", {x: 0.8, y: 0.1, message: "HEPTA KILL", timeout: 750});
            else if (hit_count == 8)
                serv_io.sockets.emit("StageMessage", {x: 0.8, y: 0.1, message: "OCTO KILL", timeout: 750});
            else if (hit_count >= 9)
                serv_io.sockets.emit("StageMessage", {x: 0.8, y: 0.1, message: "MASSACRE!", timeout: 750});
        }
    },
    processMessage: function(socket_id, message) {
        var setNamePatt = new RegExp("\setname \\w","i");
        if (setNamePatt.test(message.text))
        {
            serv_io.sockets.emit("ChangeName", GameState.Users[socket_id].name.text, {text: message.text.substring(9, message.text.length), x:GameState.Users[socket_id].x, y:GameState.Users[socket_id].y}, socket_id);
            GameState.Users[socket_id].name.text = message.text.substring(9, message.text.length);
            serv_io.sockets.emit("MessageReceived", "[SERVER]: " + message.name + " changed to " + GameState.Users[socket_id].name.text);
        }
        else
            serv_io.sockets.emit("MessageReceived", message.name + ": " + message.text);
    },
    createGameState: function(level)
    {
        GameState.uid = 1;
        GameState.leader = leader_election();
        GameState.level = level;
        GameState.aliveEnemies = computeAliveEnemies(level);
        GameState.config = CONFIG;
        GameState.crown_position = {x: CONFIG.Items.crown.start_pos[0], y: CONFIG.Items.crown.start_pos[1]};
        GameState.config.Player.leader_speed = GameState.config.Player.regular_speed;

        GameState.Enemies = {};
        for (var i=0; i< GameState.aliveEnemies; i++)
        {   
            var types = ['common_enemy', 'flux_enemy'];
            var acceleration = 0.5
            var attack_radius = 5;
            if (i < Math.ceil(GameState.aliveEnemies * 0.25)) //Creating fluxes
            {
                speed = 0;
                type = types[1];
                acceleration = CONFIG.Enemy.flux_enemy.acceleration;
                attack_radius = CONFIG.Enemy.flux_enemy.attack_radius;
            }
            else
            {
                attack_radius = CONFIG.Enemy.common_enemy.attack_radius;
                speed = common.randomInt(CONFIG.Enemy.common_enemy.min_speed, CONFIG.Enemy.common_enemy.max_speed);
                type = types[0];
            }
            var direction = common.randomInt(0, 4);
            if (direction == 0)
            {
                range = {
                    x: common.randomInt(CONFIG.Game.spawn_pos["0x"][0], CONFIG.Game.spawn_pos["0x"][1]),
                    y: common.randomInt(CONFIG.Game.spawn_pos["0y"][0], CONFIG.Game.spawn_pos["0y"][1])
                }
            }
            else if (direction == 1){
                range = {
                    x: common.randomInt(CONFIG.Game.spawn_pos["1x"][0], CONFIG.Game.spawn_pos["1x"][1]),
                    y: common.randomInt(CONFIG.Game.spawn_pos["1y"][0], CONFIG.Game.spawn_pos["1y"][1])
                }
            }
            else if (direction == 2){
                range = {
                    x: common.randomInt(CONFIG.Game.spawn_pos["2x"][0], CONFIG.Game.spawn_pos["2x"][1]),
                    y: common.randomInt(CONFIG.Game.spawn_pos["2y"][0], CONFIG.Game.spawn_pos["2y"][1])
                }
            }
            else{
                range = {
                    x: common.randomInt(CONFIG.Game.spawn_pos["3x"][0], CONFIG.Game.spawn_pos["3x"][1]),
                    y: common.randomInt(CONFIG.Game.spawn_pos["3y"][0], CONFIG.Game.spawn_pos["3y"][1])
                }
            }
            GameState.Enemies[i] = new ServerEnemy(range.x, range.y, 100,
                                                   [speed, speed],
                                                   type, "idle", 
                                                   acceleration,
                                                   attack_radius);
        }
        socket_list[GameState.leader].emit("StageMessage", {x: 0.5, y:0.5, message: "You are the leader!", timeout: 3000});
        serverinterval = setInterval(serverloop, 1000/CONFIG.Game.max_fps);
    },
    destroyGameState: function() {
        clearInterval(serverinterval);
        GameState = {};
        GameState.Users = {};
        GameState.config = CONFIG;
        GameState.Enemies = {};
        GameState.crown_position = {x: CONFIG.Items.crown.start_pos[0], y: CONFIG.Items.crown.start_pos[1]};
    }
}





////////////////////////////////
//
//Private functions
//
////////////////////////////////
function leader_election()
{
    var user_list = []
    for(var k in GameState.Users)
        user_list.push(k);
    return user_list[common.randomInt(0, user_list.length-1)];
}
function randomName(){
    return NAMES[common.randomInt(0, NAMES.length-1)];
}
function getLeader() {return GameState.Users[GameState.leader];}
    

function computeAliveEnemies(x) {return Math.floor((2 * Math.pow((GameState.level+2), 1.5)) + 5);}
    


function setCrownPosition(user)
{
    return {x: user.x + GameState.config.Items.crown.offset[0],
            y: user.y + GameState.config.Items.crown.offset[1]};
}
function GameOver(callback) {
    clearInterval(serverinterval);
    serv_io.sockets.emit("reset");
    serv_io.sockets.emit("StageMessage", {x: 0.5, y: 0.5, message: "GAME OVER! The leader died.", timeout: 3000});
    module.exports.createGameState(1);
}
function NextLevel(){
    clearInterval(serverinterval);
    serv_io.sockets.emit("reset");
    serv_io.sockets.emit("StageMessage", {x: 0.5, y: 0.5, message: "Level Complete", timeout: 3000});
    module.exports.createGameState(GameState.level+1);
}

function serverloop()
{
    for(var key in GameState.Enemies)
        if (GameState.Enemies[key])
            GameState.Enemies[key].update();

    if (GameState.aliveEnemies == 0)
        NextLevel();
    
    GameState.uid += 1;
    GameState.time = Date.now();
    serv_io.sockets.emit('setGameState', GameState);
}



function ServerEnemy(x, y, life, speed, type, current_animation, acceleration, attack_radius)
{
    this.x = x;
    this.y = y;
    this.attack_radius = attack_radius;
    this.life = life;
    this.speed = speed;
    this.type = type;
    this.acceleration = acceleration;
    this.current_animation = current_animation;

    this.update = function (){
        leader = getLeader();

        if (this.type === 'common_enemy')
        {
            if (this.x + this.speed[0]/2 < leader.x)
            {   this.x += this.speed[0];
                if (this.current_animation != "right")
                    this.current_animation = "right";
            }
            else if (this.x - this.speed[0]/2 > leader.x)
            {   this.x -= this.speed[0];
                if (this.current_animation != "left")
                    this.current_animation = "left";
            }
            if (this.y + this.speed[1]/2 < leader.y)
            {   this.y += this.speed[1];
                if (this.current_animation != "down")
                    this.current_animation = "down";
            }
            else if (this.y - this.speed[1]/2> leader.y)
            {   this.y -= this.speed[1];
                if (this.current_animation != "up")
                    this.current_animation = "up";
            }
        }
        else if (this.type === 'flux_enemy')
        {
            MAXSPEED = CONFIG.Enemy.flux_enemy.max_speed;
            if (this.x < leader.x)
            {   
                this.speed[0] += this.acceleration;
                if (this.current_animation != "right")
                    this.current_animation = "right";
            }
            else if (this.x > leader.x)
            {   
                this.speed[0] -= this.acceleration;
                if (this.current_animation != "left")
                    this.current_animation = "left";
            }
            if (this.speed[0] > MAXSPEED)
                this.speed[0] = MAXSPEED;
            else if (this.speed[0] < -MAXSPEED)
                this.speed[0] = -MAXSPEED;
            this.x += this.speed[0];

            if (this.y < leader.y)
            {   
                this.speed[1] += this.acceleration;
                if (this.current_animation != "down")
                    this.current_animation = "down";
            }
            else if (this.y > leader.y)
            {   
                this.speed[1] -= this.acceleration;
                if (this.current_animation != "up")
                    this.current_animation = "up";
            }
            if (this.speed[1] > MAXSPEED)
                this.speed[1] = MAXSPEED;
            else if (this.speed[1] < -MAXSPEED)
                this.speed[1] = -MAXSPEED;

            this.y += this.speed[1];
        }

        if (this.life > 0 && common.euclidean_distance(this, leader) < this.attack_radius)
        {
            serv_io.sockets.emit("LeaderHit", {x: leader.x, y: leader.y});
            GameState.aliveEnemies -= 1;
            this.life = 0;
            GameState.config.Player.leader_speed = Math.floor(GameState.config.Player.leader_speed / 2);
            if (GameState.config.Player.leader_speed == 0)
                GameOver();
        }
    }
}