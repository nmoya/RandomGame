//Shape and cache example
circle = new createjs.Shape();
circle.graphics.beginFill("red").drawCircle(0, 0, 40);
circle.snapToPixel = true;
circle.cache(-40, -40, 40*2, 40*2);