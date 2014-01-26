function _Enemy(speed)
{	var data =
	{	images: [Image_Path+"user.png"],
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
	this.obj = new createjs.Sprite(spriteSheet);
	this.speed = speed;
	this.radiusToCollide = 10;

	this.update = function()
	{	if (this.obj.x < Player.obj.x)
		{	this.obj.x += this.speed;
            if (this.obj.currentAnimation != "right")
			    this.obj.gotoAndPlay("right");
		}
		else if (this.obj.x > Player.obj.x)
		{	this.obj.x -= this.speed;
            if (this.obj.currentAnimation != "left")
                this.obj.gotoAndPlay("left");
		}
		if (this.obj.y < Player.obj.y)
		{	this.obj.y += this.speed;
            if (this.obj.currentAnimation != "down")
                this.obj.gotoAndPlay("down");
		}
		else if (this.obj.y > Player.obj.y)
		{	this.obj.y -= this.speed;
            if (this.obj.currentAnimation != "up")
                this.obj.gotoAndPlay("up");
		}

        if (distance(this.obj, Player.obj) < 5)
        {
            gameOver();
        }
	}
	this.setStartPosition = function()
	{	setPos(this.obj, randomInt(Canvas.width, Canvas.width*2), randomInt(0, Canvas.height));
	}
}