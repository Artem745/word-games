$(document).ready(function() {
    $('#new-word-button').click(function() {
        $.ajax({
            url: "",  
            type: "GET",
            dataType: "json",
            success: function(response) {
                if (response.status === 'success') {
                    $('#word-container').html(response.update_html);
                }
            },
            error: function(xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
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