/* 
 *  This file is part of the GLue.
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 */


 (function($){
  $.fn.overlayMask = function (action) {
    var mask = this.find('.overlay-mask');

    // Create the required mask
    if (!mask.length) {
      this.css({
        position: 'relative'
      });
    //@TODO: 将css扔到外部文件中。
      mask = $('<div class="overlay-mask"><img src="/libs/image/waiting.gif" style="display:block; margin-left: auto; margin-right: auto; max-width:100%;max-height:100%;" /></div>');
      mask.css({
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px',
        background : '#fff',
        filter : "alpha(opacity=60)",
        opacity : "0.60",
        zIndex: 1000
      }).appendTo(this);
    }

    // Act based on params

    if (!action || action === 'show') {
      mask.show();
    } else if (action === 'hide') {
      mask.hide();
    }

    return this;
  };
})(jQuery)