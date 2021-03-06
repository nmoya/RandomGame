function Particle (color, minSize, maxSize)
{
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(color).drawCircle(0, 0, common.randomFloat(minSize, maxSize));
    this.velocityX = 0;
    this.velocityY = 0;
    this.scaleSpeed = 0.1;

    this.update = function()
    {
        // moving away from explosion center
        this.shape.x += this.velocityX;
        this.shape.y += this.velocityY;

        // shrinking
        this.shape.setTransform(x=this.shape.x
                               ,y=this.shape.y
                               ,scaleX=this.shape.scaleX-this.scaleSpeed
                               ,scaleY=this.shape.scaleY-this.scaleSpeed)

        if (this.shape.scaleX <= 0.1)
            Stage.removeChild(this.shape)
        
    };

}

function createExplosion(x, y)
{
    var minSize = 5;
    var maxSize = 10;
    var count = 10;
    var minSpeed = 1.0;
    var maxSpeed = 5.0;
    var minScaleSpeed = 0.03;
    var maxScaleSpeed = 0.08;

    for (var angle=0; angle<360; angle += Math.round(360/count))
    {
        if (common.randomInt(0, 1) == 0)
            var particle = new Particle("orange", minSize, maxSize);
        else
            var particle = new Particle("black", minSize, maxSize);

        particle.shape.x = x;
        particle.shape.y = y;

        particle.scaleSpeed = common.randomFloat(minScaleSpeed, maxScaleSpeed);
        var speed = common.randomFloat(minSpeed, maxSpeed);

        particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
        particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

        Stage.addChild(particle.shape);
        StageObjects.particlesList.push(particle);
    }
}