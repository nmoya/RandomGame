//Docs: http://notifyjs.com/

//Usage:
    //gnotify("Hello World", "success");
    //gnotify("Hello World", "warn");
    //gnotify("Hello World", "info");
    //gnotify("Hello World", "error");



$.notify.defaults({ arrowShow: true });
$.notify.defaults({ clickToHide: true });
$.notify.defaults({ autoHide: true });
$.notify.defaults({ autoHideDelay: 2500 });
$.notify.defaults({ globalPosition: 'bottom right' });
$.notify.defaults({ elementPosition: 'bottom left' });
function gnotify (text, type) {
    if (type == 'info')
        $.notify(text, {className: type, globalPosition: "top left", autoHideDelay: 5000} );
    else
        $.notify(text, type);
};

function enotify (element, text, type) {
  if (type == "info")
  {
    $.notify(element, text, {className: type, arrowShow: false, autoHideDelay: 3000, clickToHide: false});
  }
  else
    $.notify(element, text, type);
}

function snotify (x, y, text, type){
  configs = {className: type, arrowShow: false, autoHideDelay: 3000, clickToHide: false};
  var div = document.createElement('a');
  div.setAttribute("style", "position:absolute; top:"+y*Canvas.height+"; left:"+x*Canvas.width+";");
  div.setAttribute("id", "tempDiv");
  document.getElementById('holder').appendChild(div);
  $.notify($("#tempDiv"), text, configs);
  document.getElementById("tempDiv").remove();
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