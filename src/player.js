function _Player ()
{
    var data = null;
    data = {
        images: [Image_Path+"programmer.png"],
        //frames: {width:48, height:48},
        frames: {width:42, height:52},
        animations: {
             idle_front: {
                frames: [5, 12],
                next: true,
                speed: 0.3
             },
             idle_left: {
                frames: [4, 11],
                next: true,
                speed: 0.3
             },
             idle_right: {
                frames: [6, 13],
                next: true,
                speed: 0.3
             },
             left: {
                frames: [1, 8, 15, 22],
                next: true,
                speed: 0.3
             },
             right: {
                frames: [0, 7, 14, 21],
                next: true,
                speed: 0.3
             },
             up: {
                frames: [3, 10],
                next: true,
                speed: 0.3
             },
             down: {
                frames: [2, 9],
                next: true,
                speed: 0.3
             },
        }
    };
    var spriteSheet = new createjs.SpriteSheet(data);
    this.obj = new createjs.Sprite(spriteSheet, "idle_front");
    this.speed = 6;

    //Load the sign
    data = {
        images: [Image_Path+"sign.png"],
        frames: {width:29, height:9},
        animations: {
             idle: {
                frames: [0],
                next: true
             }
         }
     };
    var spriteSheet = new createjs.SpriteSheet(data);
    this.sign = new createjs.Sprite(spriteSheet, "idle");


    data = {
        images: [Image_Path+"keyboard.png"],
        frames: {width:30, height:30},
        animations: {
             up: {
                frames: [0, 1, 2, 3],
                next: false,
                speed: 0.4
             },
             down: {
                frames: [4, 5, 6, 7],
                next: false,
                speed: 0.4
             },
             left: {
                frames: [8, 9, 10, 11],
                next: false,
                speed: 0.4
             },
             right: {
                frames: [12, 13, 14, 15],
                next: false,
                speed: 0.4
             }
         }
     };
    var spriteSheet = new createjs.SpriteSheet(data);
    this.weapon = new createjs.Sprite(spriteSheet);
    this.weapon.addEventListener("animationend", function(){
        setPos(Player.weapon, -100, -100);
    })


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

   
    this.update = function()
    {
        if (outOfCanvas(this.obj))
            setPos(this.obj, randomInt(0, Canvas.width), randomInt(0, Canvas.height));

        if (Key.isDown(Key.UP))
        {
            if (this.obj.currentAnimation != "up")
                this.obj.gotoAndPlay("up");
            setPos(this.obj, this.obj.x, this.obj.y-this.speed);
        }
        if (Key.isDown(Key.LEFT))
        {
            if (this.obj.currentAnimation != "left")
                this.obj.gotoAndPlay("left");
            setPos(this.obj, this.obj.x-this.speed, this.obj.y);
        }
        if (Key.isDown(Key.DOWN))
        {
            if (this.obj.currentAnimation != "down")
                this.obj.gotoAndPlay("down");
            setPos(this.obj, this.obj.x, this.obj.y+this.speed);
        }
        if (Key.isDown(Key.RIGHT))
        {
            if (this.obj.currentAnimation != "right")
                this.obj.gotoAndPlay("right");
            setPos(this.obj, this.obj.x+this.speed, this.obj.y);
        }
        if (Key.isDown(Key.SPACE))
        {
            var curr = this.obj.currentAnimation;

            var offset = {x: 20, y: 30}; //px
            
            if (curr == "up")
            {   setPos(this.weapon, this.obj.x, this.obj.y - offset.x);
                this.weapon.gotoAndPlay("up");
            }
            else if (curr == "down")
            {   setPos(this.weapon, this.obj.x, this.obj.y + offset.y);
                this.weapon.gotoAndPlay("down");
            }
            else if (curr == "left")
            {   setPos(this.weapon, this.obj.x - offset.x, this.obj.y+10);
                this.weapon.gotoAndPlay("left");
            }
            else if (curr == "right")
            {   setPos(this.weapon, this.obj.x + offset.x, this.obj.y+10); 
                this.weapon.gotoAndPlay("right");
            }
            // else
            //     this.weapon.gotoAndPlay("down");

        }
        else
        {
            //
        }

        if (Key.isDown(Key.RIGHT) || Key.isDown(Key.LEFT) || Key.isDown(Key.UP) || Key.isDown(Key.DOWN))
        {   
            setPos(User, Player.obj.x / Canvas.width, Player.obj.y / Canvas.height);
            setPos(this.sign, this.obj.x+5, this.obj.y+43);
        }
        if (GameState.leader == User.id)
        {
            setPos(this.crown, this.obj.x+5, this.obj.y-30);
        }
            
    };
}