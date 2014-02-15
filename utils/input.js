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
  ENTER:    13,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  //As long as the user keep it pressed
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  //When the user releases the button
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  },

  textInputOn: function(event) {
    if (event.keyCode == this.ENTER)
    {
      if (Text_input)
      {
        $(".text-history").stop();
        $(".text-history").hide(1000);
        $(".text-input").hide(1000);
        $('.text-input').blur();
        Text_input = false;

        if ($(".text-input").val() != '')
          socket.emit("MessageSentByUser", {name: Player.name.text, text: $(".text-input").val()});
      }
      else {
        $(".text-history").show(100);
        $(".text-input").show(100, function(){
          $(".text-input").val("");
          $(".text-input").focus();
          Text_input = true;
        });
      }
      
    }
  }
};