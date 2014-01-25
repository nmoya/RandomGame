//Shape and cache example
circle = new createjs.Shape();
circle.graphics.beginFill("red").drawCircle(0, 0, 40);
circle.snapToPixel = true;
circle.cache(-40, -40, 40*2, 40*2);



//Check for explosion
if (distance(Player.obj, user_key) < 5)
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