$(document).ready(function () {
    /**
     *Custom scrollbar
     */
    (function ($) {
        var testChromeBrowser = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
        if (testChromeBrowser) {
            $(window).on("load", function () {
                $("#wrapper").mCustomScrollbar({
                    scrollButtons: {enable: true},
                    theme: "light-thick",
                    scrollbarPosition: "outside",
                    scrollInertia: 300,
                    mouseWheelPixels: 50,
                    callbacks: {
                        whileScrolling: function () {
                            if (this.mcs.top < -100) {
                                $('#return-to-top').fadeIn();
                            }
                            else {
                                $('#return-to-top').fadeOut();
                            }
                        },
                        onOverflowYNone: function () {
                            $('#return-to-top').hide();
                        }
                    }
                });

                /**
                 *Scroll Up Button
                 */
                (function ($) {

                    window.addEventListener('scrollTop', function (e) {
                        $("#wrapper").mCustomScrollbar("scrollTo", "top", {
                            scrollEasing: "easeOut"
                        });
                    }, false);

                    $('#return-to-top').click(function () {
                        window.dispatchEvent(new Event('scrollTop'));
                    });

                })(jQuery);

            });
        }
    })(jQuery);

});
