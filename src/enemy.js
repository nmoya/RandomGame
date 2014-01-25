function _Enemy()
{	var data =
	{	images: [Image_Path+"Anaconda.png"],
		frames: {width:48, height:48},
		animations:
		{	idle: [36,38, true, 0.1]
		,	left:[48,50, true, 0.1]
		,	right:[60,62, true, 0.1]
		,	up:[72,74, true, 0.1]
		}
	};
	var spriteSheet = new createjs.SpriteSheet(data);
	this.obj = new createjs.Sprite(spriteSheet, "idle");
	this.speed = 3;
	this.radiusToCollide = 10;

	this.update = function()
	{	if (this.obj.x < Player.obj.x)
		{	this.obj.x += this.speed;
		}
		else if (this.obj.x > Player.obj.x)
		{	this.obj.x -= this.speed;
		}

		if (this.obj.y < Player.obj.y)
		{	this.obj.y += this.speed;
		}
		else if (this.obj.y > Player.obj.y)
		{	this.obj.y -= this.speed;
		}
	}
	this.setStartPosition = function()
	{	setPos(this.obj, randomInt(Canvas.width, Canvas.width*2), randomInt(0, Canvas.height));
	}
}