function Player ()
{
    var data = {
        images: [Paths.anaconda_image],
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
    this.directionArray = []
    this.directionArray.push(new Vector2D(3, 0)); // 0 right
    this.directionArray.push(new Vector2D(-3, 0)); // 1 left
    this.directionArray.push(new Vector2D(0, -3)); // 2 up
    this.directionArray.push(new Vector2D(0, 3)); // 3 down

    this.update = function()
    {
        if (outOfCanvas(this.obj))
            setPos(this.obj, randomInt(0, Canvas.width), randomInt(0, Canvas.height));

        if (Key.isDown(Key.UP))
        {
            if (this.obj.currentAnimation != "up")
                this.obj.gotoAndPlay("up");
            setPosVec(this.obj, this.directionArray[2].sum(this.obj));
        }
        if (Key.isDown(Key.LEFT))
        {
            if (this.obj.currentAnimation != "left")
                this.obj.gotoAndPlay("left");
            setPosVec(this.obj, this.directionArray[1].sum(this.obj));
        }
        if (Key.isDown(Key.DOWN))
        {
            if (this.obj.currentAnimation != "idle")
                this.obj.gotoAndPlay("idle");
            setPosVec(this.obj, this.directionArray[3].sum(this.obj));
        }
        if (Key.isDown(Key.RIGHT))
        {
            if (this.obj.currentAnimation != "right")
                this.obj.gotoAndPlay("right");
            setPosVec(this.obj, this.directionArray[0].sum(this.obj));
        }
            
    };
}