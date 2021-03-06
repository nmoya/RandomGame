function _StageObjects()
{   
    this.bloodList      = [];
    this.particlesList  = [];
    this.namesList      = {};
    /*var data =
    {   images: [Image_Path+"crown.png"],
        frames: {width:42, height:48},
        animations: {
             left: {
                frames: [1, 8, 15, 22],
                next: true,
                speed: 0.2
             },
             right: {
                frames: [0, 7, 14, 21],
                next: true,
                speed: 0.2
             },
             up: {
                frames: [3, 10],
                next: true,
                speed: 0.2
             },
             down: {
                frames: [2, 9],
                next: true,
                speed: 0.2
             }
        }
    };
    var spriteSheet = new createjs.SpriteSheet(data);
    this.obj = new createjs.Sprite(spriteSheet);*/
    data = {
        images: [Image_Path+"crown.png"],
        frames: {width:30, height:40},
        animations: {
             idle: {
                frames: [0],
                next: true,
                speed: 1
             }
         }
     };
    var spriteSheet = new createjs.SpriteSheet(data);
    this.crown = new createjs.Sprite(spriteSheet);

    

    this.loadStage = function(){
        //Adding the objects
        Stage.addChild(this.crown);    
    }

    this.update = function(GameState)
    {
        var i =0;
        if (!Player.isLeader())
            common.setPos(this.crown, GameState.crown_position.x, GameState.crown_position.y);
        else
            common.setPos(this.crown, Player.obj.x+GameState.config.Items.crown.offset[0],
                                      Player.obj.y+GameState.config.Items.crown.offset[1]);

        for (i=0; i < this.particlesList.length; i++)
            this.particlesList[i].update();
    }
    this.addBlood = function(pos)
    {
        data = {
            images: [Image_Path+"blood.png"],
            frames: {width:60, height:60},
            animations: {
                 start: 
                 {
                    frames: [0, 1, 2, 3],
                    next: false,
                    speed: 0.5
                }
            }
        };
        spriteSheet = new createjs.SpriteSheet(data);
        var b = new createjs.Sprite(spriteSheet, "start");
        this.bloodList.push(b);
        common.setPos(b, pos.x, pos.y);
        Stage.addChildAt(b, 1);
    }
    this.cleanBloodList = function()
    {
        for (var b in this.bloodList)
            Stage.removeChild(this.bloodList[b]);
        this.bloodList = [];
    }
    this.addName = function(name){
        n = new createjs.Text(name.text, "12px Arial", "#ffffff");
        n.textAlign = "center";
        this.namesList[name.text] = n;
        Stage.addChild(n);
    }
    this.removeName = function(name){
        Stage.removeChild(this.namesList[name.text]);
        delete this.namesList[name.text];
    }
    this.changeName = function(oldname, newname)
    {
        this.removeName({text: oldname});
        this.addName(newname);
    }
    this.updateName = function(name, x, y){
        common.setPos(this.namesList[name.text], x, y);
    }
}