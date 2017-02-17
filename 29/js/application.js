$(document).ready(function() {

    $(window).scroll(function() {
        if ($(document).scrollTop() > 50) {
            $('.navbar-fixed-top').addClass('shrink');
        } else {
            $('.navbar-fixed-top').removeClass('shrink');
        }
    });

    $('.selectpicker').selectpicker();

    $('#quote-carousel').carousel({
        pause: true,
        interval: 4000,
    });

    $(function() {
        $("a[href^='#']").on('click', function(event) {
            if (this.hash !== "") {

                var hash = this.hash;

                $('#collapse1').removeClass('in'); // close right menu after click
                if (window.innerWidth > 768) { // screen width
                    $('html, body').animate({
                        scrollTop: $(hash).offset().top - 50 // top margin
                    }, 900, function() {
                        //window.location.hash = hash;

                    });
                } else {
                    $('html, body').animate({
                        scrollTop: $(hash).offset().top - 49
                    }, 900, function() {
                        //window.location.hash = hash;

                    });
                }
            }
        });
    });

    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('#time').datetimepicker({
        datepicker: false,
        theme: 'dark',
        format: 'H:i',
        allowTimes: ['12:00', '13:00', '15:00', '17:00', '17:05', '17:20', '19:00', '20:00'],
        step: 5
    });

    $('#date').datetimepicker({
        timepicker: false,
        theme: 'dark',
        format: 'd/m/Y',
        formatDate: 'Y/m/d',

        // disabled weekends
        onGenerate: function(ct) {
            $(this).find('.xdsoft_date.xdsoft_weekend')
                .addClass('xdsoft_disabled');
        },
        // holidays
        disabledDates: ['2017/06/01', '2017/06/02', '2017/06/03'],

        minDate: '--1970/01/02', // today is minimum date
        maxDate: '+1970/02/02' // and month is maximum active date calendar
    });

});