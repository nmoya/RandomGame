function _Enemy()
{	var data =
	{	images: [Image_Path+"user.png"],
		frames: {width:42, height:48},
		animations: {
             idle_front: {
                frames: [5, 12],
                next: true,
                speed: 0.2
             },
             idle_left: {
                frames: [4, 11],
                next: true,
                speed: 0.2
             },
             idle_right: {
                frames: [6, 13],
                next: true,
                speed: 0.2
             },
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
                frames: [4, 9],
                next: true,
                speed: 0.2
             },
             down: {
                frames: [2, 9],
                next: true,
                speed: 0.2
             },
        }
	};
	var spriteSheet = new createjs.SpriteSheet(data);
	this.obj = new createjs.Sprite(spriteSheet, "idle_front");
	this.speed = 2;
	this.radiusToCollide = 10;

	this.update = function()
	{	if (this.obj.x < Player.obj.x)
		{	this.obj.x += this.speed;
			this.obj.gotoAndPlay("right");
		}
		else if (this.obj.x > Player.obj.x)
		{	this.obj.x -= this.speed;
			this.obj.gotoAndPlay("left");
		}
		if (this.obj.y < Player.obj.y)
		{	this.obj.y += this.speed;
			this.obj.gotoAndPlay("down");
		}
		else if (this.obj.y > Player.obj.y)
		{	this.obj.y -= this.speed;
			this.obj.gotoAndPlay("up");
		}
	}
	this.setStartPosition = function()
	{	setPos(this.obj, randomInt(Canvas.width, Canvas.width*2), randomInt(0, Canvas.height));
	}
}