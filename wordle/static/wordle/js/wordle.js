$(document).ready(function() {
    $(".category-button").click(function () {
        var length = $(this).data('length'); 

        console.log("Button clicked, length: " + length); 

        $.ajax({
            url: "wordle/",  
            type: "GET",
            data: { "length": length }, 
            success: function(response) {
                if (response.status === 'success') {
                    $('.content').html(response.update_html);
                } else {
                    console.error("Error: " + response.message); 
                }
            },
            error: function(xhr, errmsg, err) {
                console.error("AJAX error: " + xhr.status + ": " + xhr.responseText); 
            }
        });
    });

    $(document).on('click', '.submit-button', function() {
        var letters = [];
        $(".letters-input").each(function() {
            letters.push($(this).val());
        });

        var allFilled = letters.every(function(letter) {
            return letter !== "";
        });

        if (allFilled) {
            console.log("All letters filled:", letters);

            $.ajax({
                url: "check_word/",  // Новий обробник
                type: "POST",
                data: {
                    letters: letters,
                    csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()  // Додано CSRF токен
                },
                success: function(response) {
                    console.log("Server response:", response);
                },
                error: function(xhr, errmsg, err) {
                    console.error("AJAX error: " + xhr.status + ": " + xhr.responseText);
                }
            });
        } else {
            console.log("Not all letters are filled.");
        }
    });
});



$(document).on('keyup', '.letters-input', function (event) {
    var inputVal = $(this).val();
    if (inputVal.length === 1 && inputVal.match(/^[a-zA-Z]{1}$/)) {
        var nextInput = $(this).next('.letters-input');
        if (!(nextInput.length)) {
            console.log('end');
        } else {
            nextInput.focus();
        }
    }
})

$(document).on('keydown', '.letters-input', function (event) {
    if (event.key === 'Backspace' && $(this).val() === '') {
        var prevInput = $(this).prev('.letters-input');
        if (prevInput.length) {
            prevInput.focus();
        }
    }
});