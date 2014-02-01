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

}