//Docs: http://notifyjs.com/

//Usage:
    //nmessage("Hello World", "success");
    //nmessage("Hello World", "warn");
    //nmessage("Hello World", "info");
    //nmessage("Hello World", "error");



$.notify.defaults({ arrowShow: true });
$.notify.defaults({ clickToHide: true });
$.notify.defaults({ autoHide: true });
$.notify.defaults({ autoHideDelay: 2500 });
$.notify.defaults({ globalPosition: 'top right' });
$.notify.defaults({ elementPosition: 'bottom left' });
function nmessage (text, type) {
    if (type == 'info')
        $.notify(text, {className: type, globalPosition: "bottom left"} );
    else
        $.notify(text, type);
};

function emessage (element, text, type) {
    $.notify(element, text, type);
}







/*
{
  // whether to hide the notification on click
  clickToHide: true,
  // whether to auto-hide the notification
  autoHide: true,
  // if autoHide, hide after milliseconds
  autoHideDelay: 5000,
  // show the arrow pointing at the element
  arrowShow: true,
  // arrow size in pixels
  arrowSize: 5,
  // default positions
  elementPosition: 'bottom left',
  globalPosition: 'top right',
  // default style
  style: 'bootstrap',
  // default class (string or [string])
  className: 'error',
  // show animation
  showAnimation: 'slideDown',
  // show animation duration
  showDuration: 400,
  // hide animation
  hideAnimation: 'slideUp',
  // hide animation duration
  hideDuration: 200,
  // padding between element and notification
  gap: 2
}
*/