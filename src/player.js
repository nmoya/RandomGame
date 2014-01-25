function _Player ()
{
    var data = {
        images: [Image_Path+"Anaconda.png"],
        frames: {width:48, height:48},
        animations: {
            idle: [0,2, true, 0.1]
           ,left:[12,14, true, 0.1]
           ,right:[24,26, true, 0.1]
           ,up:[36,38, true, 0.1]
        }
    };
    var spriteSheet = new createjs.SpriteSheet(data);
    this.obj = new createjs.Sprite(spriteSheet, "idle");
    this.speed = 3

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
            if (this.obj.currentAnimation != "idle")
                this.obj.gotoAndPlay("idle");
            setPos(this.obj, this.obj.x, this.obj.y+this.speed);
        }
        if (Key.isDown(Key.RIGHT))
        {
            if (this.obj.currentAnimation != "right")
                this.obj.gotoAndPlay("right");
            setPos(this.obj, this.obj.x+this.speed, this.obj.y);
        }

        if (Key.isDown(Key.RIGHT) || Key.isDown(Key.LEFT) || Key.isDown(Key.UP) || Key.isDown(Key.DOWN))
        {   setPos(User, Player.obj.x / Canvas.width, Player.obj.y / Canvas.height);
            socket.emit("update_coords", User);
        }
            
    };
}