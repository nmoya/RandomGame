var Key = {
  _pressed: {},

  //http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SHIFT:  16,
  CTRL:   17,
  ESCAPE:   27,
  P:        80,
  S:        83,
  SPACE:    32,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};