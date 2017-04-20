$(document).ready(function() {
    // vars
    var elementGetValues = $('#getvalues');
    var elementSubmit = $('#form');
    var elementReset = $('#reset');

    var elementName = $('#name');
    var elementDate = $('#date');


    elementSubmit.submit(function(e) {
        e.preventDefault();
    });

    // custom rules
    $.validator.addMethod("onlyNumber", function(value, element) {
        var reg = /[0-9]/;
        if (this.optional(element) || reg.test(value)) {
            return false;
        } else {
            return true;
        }
    });

    $.validator.addMethod("validDate", function(value, element) {
        if (this.optional(element) || moment(value, "YYYY/MM/DD", true).isValid()) {
            return true;
        } else {
            return false;
        }
    });

    $.validator.addMethod("futureDate", function(value, element) {
        if (this.optional(element) || moment().diff(value) >= 0) {
            return true;
        } else {
            return false;
        }
    });

    $.validator.addMethod("onlyAdult", function(value, element) {
        if (this.optional(element) || moment().diff(moment(value, "YYYY/MM/DD", true), 'years') > 17) {
            return true;
        } else {
            return false;
        }
    });


    $("form").validate({
        rules: {
            'name': {
                required: true,
                minlength: 2,
                onlyNumber: true,
                maxlength: 20
            },
            'date': {
                required: true,
                validDate: true,
                futureDate: true,
                onlyAdult: true
            }
        },

        messages: {
            name: {
                required: "Pole jest wymagane",
                minlength: "Minimum 2 znaki",
                onlyNumber: "Cyfry nie sa dozwolone",
                maxlength: "Maksymalnie 20 znaków"
            },
            date: {
                required: "Pole jest wymagane",
                validDate: "Data jest w niepoprawnym formacie. Poprawny format: RRRR/MM/DD | wiek +18 | Nie może być wyższa od daty dzisiejszej",
                futureDate: "Data jest w niepoprawnym formacie. Poprawny format: RRRR/MM/DD | wiek +18 | Nie może być wyższa od daty dzisiejszej",
                onlyAdult: "Data jest w niepoprawnym formacie. Poprawny format: RRRR/MM/DD | wiek +18 | Nie może być wyższa od daty dzisiejszej"
            }
        },


        showErrors: function(errorMap, errorList) {

            $.each(this.successList, function(index, value) {
                $('#' + value.id + '').tooltip('destroy');
                $(value).closest('.input-group').removeClass('has-error has-feedback');
                $(value).closest('.input-group').find('i.fa').remove();
            });

            $.each(errorList, function(index, value) {
                $(value.element).closest('.input-group').removeClass('has-success has-feedback').addClass('has-error has-feedback');
                $(value.element).closest('.input-group').find('i.fa').remove();
                $(value.element).closest('.input-group').append('<i class="fa fa-exclamation form-control-feedback"></i>');

                $('#' + value.element.id + '').attr('title', value.message).tooltip({
                    placement: 'bottom',
                    trigger: 'manual',
                    delay: { show: 500, hide: 5000 }
                }).tooltip('show');

            });

        },

        // Submit -> nie przekazuje danych dalej, jedynie wyświetla komunikat, „ dziękuje za wypełnienie formularza” 
        // i ustala na komputerze użytkownika plik cookie z danymi podanymi przez użytkownika. 
        submitHandler: function(form) {
            if (confirm("Czy na pewno chcesz wysłać formularz?")) {
                // można też użyć JSON.stringify
                $.cookie("name", elementName.val(),{ path: '/' });
                $.cookie("date", elementDate.val(),{ path: '/' });
                alert("dziękuje za wypełnienie formularza");
                $('input[type="submit"]').attr('disabled', 'disabled');
            } else { alert("Wysłanie formularza zostało anulowane."); }
            return false;
        }
    });

    // Jeśli użytkownik już korzystał z formularza wyświetl komunikat „Witaj ponownie” 
    // i uzupełnij formularz danymi, które użytkownik podał wcześniej jednocześnie blokując możliwość skorzystania z pola submit.
    if ($.cookie('name') && $.cookie('date')) {
        alert("„Witaj ponownie” ");
        elementName.val($.cookie('name'));
        elementDate.val($.cookie('date'));
        $('input[type="submit"]').attr('disabled', 'disabled');
    }

    // Get Values from form! -> wyświetla dane podane przez użytkownika w konsoli przeglądarki.
    elementGetValues.on('click', function(event) {
        if (confirm("Czy na pewno chcesz wyświetlić dane podane przez użytkownika w konsoli przeglądarki?")) {
            console.log("Name: " + elementName.val());
            console.log("Date: " + elementDate.val());
        }
    });

    // Reset ->resetuje dane wpisane przed użytkownika oraz czyści dane w pliku cookie.
    elementReset.on('click', function(event) {
        if (confirm("Czy na pewno chcesz zresetować formularz?")) {
            $.removeCookie('name');
            $.removeCookie('date');
            elementName.val("");
            elementDate.val("");
            $('input[type="submit"]').removeAttr('disabled');
        }
    });

});
