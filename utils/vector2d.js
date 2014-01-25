function Vector2D(x, y)
{
    this.x = x
    this.y = y

    this.sum = function (object)
    {
        var v = new Vector2D();
        v.x = this.x + object.x;
        v.y = this.y + object.y;
        return v;
    }
}