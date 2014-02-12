if(typeof module == 'undefined')
{
    var module = {exports : {}};
}

module.exports = {
    randomInt: function(min, max) { return Math.round(min + Math.random()*(max-min)); },
    randomFloat: function(min, max) { return min + Math.random()*(max-min); },
    euclidean_distance: function(object1, object2) {return Math.sqrt( (object1.x-object2.x)*(object1.x-object2.x) + (object1.y-object2.y)*(object1.y-object2.y));},
    setPos: function(object, x, y) { if (object) object.x = x; if(object)object.y = y; }
}
common = module.exports;









//Learn closure
/*(function(exports){

    exports = 
    {
        randomInt: function(min, max)
        {
            return Math.round(min + Math.random()*(max-min));
        },
        euclidean_distance: function(object1, object2)
        {
            return Math.sqrt( (object1.x-object2.x)*(object1.x-object2.x) + (object1.y-object2.y)*(object1.y-object2.y));
        }
    }



})(typeof exports === 'undefined'? this['common']={}: exports);*/