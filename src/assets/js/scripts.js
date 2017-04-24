window.onload = (function($) {
  "use strict";

  new WOW().init();

  $('a.page-scroll').bind('click', function(event) {
      var $ele = $(this);
      $('html, body').stop().animate({
          scrollTop: ($($ele.attr('href')).offset().top - 25)
      }, 1450, 'easeInOutExpo');
      event.preventDefault();
  });

  $("#sendMessage").on("click", function(event) {
    event.preventDefault();
    var data = {
          name: $("#messageName").val(),
          _replyTo: $("#messageEmail").val(),
          message: $("#messageContent").val()
        }

    if (data.name && data._replyTo && data.message) {
      $.ajax({
          url: "//formspree.io/info@dinex.cl",
          method: "POST",
          data,
          dataType: "json"
      });
    }
  });

})(jQuery);
