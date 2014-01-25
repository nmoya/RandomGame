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
                speed: 0.1
             },
             idle_left: {
                frames: [4, 11],
                next: true,
                speed: 0.1
             },
             idle_right: {
                frames: [6, 13],
                next: true,
                speed: 0.1
             },
             left: {
                frames: [1, 8, 15, 22],
                next: true,
                speed: 0.1
             },
             right: {
                frames: [0, 7, 14, 21],
                next: true,
                speed: 0.1
             },
             up: {
                frames: [3, 10],
                next: true,
                speed: 0.1
             },
             down: {
                frames: [2, 9],
                next: true,
                speed: 0.1
             },
        }
    };
    
    var spriteSheet = new createjs.SpriteSheet(data);
    this.obj = new createjs.Sprite(spriteSheet, "idle_front");
    this.speed = 3;
    this.sign = new createjs.Sprite(Image_Path+"sign.png");


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

        if (Key.isDown(Key.RIGHT) || Key.isDown(Key.LEFT) || Key.isDown(Key.UP) || Key.isDown(Key.DOWN))
        {   
            setPos(User, Player.obj.x / Canvas.width, Player.obj.y / Canvas.height);
            setPos(this.sign, this.obj.x, this.obj.y);
            socket.emit("update_coords", User);
        }
            
    };
}