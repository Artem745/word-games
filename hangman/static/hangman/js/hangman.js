$(document).ready(function () {
    $(".category-item").click(function () {
        var category = $(this).data('category');
        $.ajax({
            type: 'GET',
            url: '/hangman/',
            data: { "category": category },
            success: function (response) {
                if (response.status === 'success') {
                    $('.hangman').html(response.update_html);
                }
            }
        });

    });

    function keyboard(thiss) {
        var clickedLetter = thiss.data('letter');
        var currentLetterDiv = $('.letter-div').filter(function () {
            return $(this).data('letter') === clickedLetter.toLowerCase() && $(this).text() === '';
        });
        if (currentLetterDiv.length) {
            currentLetterDiv.text(clickedLetter);
            thiss.addClass('right');

            var isNotWin = $('.letter-div').filter(function () {
                return $(this).text() === '';
            });
            if (!(isNotWin.length)) {
                setTimeout(function () {
                    $.ajax({
                        type: 'GET',
                        url: '/hangman/draw/',
                        data: { 'status': 'win' },
                        success: function (response) {
                            if (response.status === 'success') {
                                $('.end-screen').css('display', 'block');
                                $('.end-screen').html(response.update_html);
                            }
                        }
                    })
                }, 500);
            }

        } else {
            thiss.addClass('wrong');
            var errors = $('#errors').data("errors") || 0;
            $.ajax({
                type: 'GET',
                url: '/hangman/draw/',
                data: { 'errors': errors + 1 },
                success: function (response) {
                    if (response.status === 'success') {
                        $('.hangman-man').html(response.update_html);
                    }
                }
            })

            if (errors + 1 === 8) {
                setTimeout(function () {
                    $.ajax({
                        type: 'GET',
                        url: '/hangman/draw/',
                        data: { 'status': 'over' },
                        success: function (response) {
                            if (response.status === 'success') {
                                $('.end-screen').css('display', 'block');
                                $('.end-screen').html(response.update_html);
                            }
                        }
                    })
                }, 500);
            }
        }
    }


    // Використання делегування подій для динамічно доданих елементів
    // Для кликов по игровой клавиатуре
    $(document).on('click', '.keyboard-button', function () {
        keyboard($(this))
    });

    // Для кликов по обічной клавиатуре
    $(document).on('keypress', function (event) {
        if (event.key.match(/^[a-zA-Z]$/)) {
            thiss = $('.keyboard-button').filter(function () {
                return $(this).data('letter') === event.key.toUpperCase();
            })
            if (!$(thiss).hasClass('right') && !$(thiss).hasClass('wrong')) {
                keyboard(thiss)
            }
        }
    });
    });

// $(document).on('keyup', '.letters-input', function (event) {
//     var inputVal = $(this).val();
//     var inputName = $(this).attr("name");

//     if (inputVal.length === 1 && inputVal.match(/^[a-zA-Z]{1}$/)) {
//         var nextInput = $(this).next('.letters-input');
//         if (inputVal.toLowerCase() === inputName) {
//             if (!(nextInput.length)) {
//                 console.log('end');
//             } else {
//                 nextInput.focus();
//             }
//         } else {
//             $(this).val('');
//             var errors = $('#errors').data("errors") || 0;
//             $.ajax({
//                 type: 'GET',
//                 url: '/hangman/draw/',
//                 data: { 'errors': errors + 1 },
//                 success: function (response) {
//                     if (response.status === 'success') {
//                         $('.hangman-man').html(response.update_html);
//                     }
//                 }
//             });
//         }
//     } else if (inputVal.length === 1) {
//         $(this).blur();
//         alert('Only english letters!');
//         $(this).val('');
//     }
// });