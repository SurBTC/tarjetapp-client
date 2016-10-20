(function($) {
    "use strict";

    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 60
    });

    new WOW().init();

    $('a.page-scroll').bind('click', function(event) {
        var $ele = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($ele.attr('href')).offset().top - 60)
        }, 1450, 'easeInOutExpo');
        event.preventDefault();
    });

    $('#collapsingNavbar li a').click(function() {
        /* always close responsive nav after click */
        $('.navbar-toggler:visible').click();
    });

    $('#galleryModal').on('show.bs.modal', function (e) {
       $('#galleryImage').attr("src",$(e.relatedTarget).data("src"));
    });

    $(document).scroll(function(){
        // FIXME: Do not set transparent on small devices
        if($(this).scrollTop() > 50)
        {
           $('.navbar').css({"background":"white"});
           $('.navbar-brand').css({"color":"#007fff"});
           $('.nav-link').css({"color": "#007fff"})
        } else {
           $('.navbar').css({"background":"transparent"});
           $('.navbar-brand').css({"color":"#ddd"});
           $('.nav-link').css({"color": "#ddd"})
        }
    });

})(jQuery);