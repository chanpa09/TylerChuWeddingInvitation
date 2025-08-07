(function() {
  var init = function() {
    $('a.btn_ms').on('touchstart touchend', touchEventHandler);
    $('a.back_btn').on('touchstart touchend', touchEventHandler2);
  };
 
  var touchEventHandler = function(e) {
    if (e.type === 'touchstart') {
      $(this).addClass('btn_ms_hover');
    } else {
      $(this).removeClass('btn_ms_hover');
    }
  };
  var touchEventHandler2 = function(e) {
    if (e.type === 'touchstart') {
      $(this).addClass('back_btn_hover');
    } else {
      $(this).removeClass('back_btn_hover');
    }
  };
 
  $(init); // onload
})();
