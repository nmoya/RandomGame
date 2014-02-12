//Shape and cache example
circle = new createjs.Shape();
circle.graphics.beginFill("red").drawCircle(0, 0, 40);
circle.snapToPixel = true;
circle.cache(-40, -40, 40*2, 40*2);



//Check for explosion
if (common.euclidean_distance(Player.obj, user_key) < 5)
    createExplosion(Player.obj.x, Player.obj.y);


//Update particles
for (var i=0; i<particles.length; i++)
    particles[i].update();


if (Key.isDown(Key.S))
{
    if (createjs.Sound.getMute())
        createjs.Sound.setMute(false);
    else
        createjs.Sound.setMute(true);
}


//Load sword lr
    /*data = {
        images: [Image_Path+"sword.png"],
        frames: {width:48, height:98},
        animations: {
             left_attack: {
                frames: [0, 2, 4, 6, 8],
                next: false,
                speed: 0.4
             },
             right_attack: {
                frames: [1, 3, 5, 7, 9],
                next: false,
                speed: 0.4
             }
         }
     };
    var spriteSheet = new createjs.SpriteSheet(data);
    this.weapon = new createjs.Sprite(spriteSheet);*/