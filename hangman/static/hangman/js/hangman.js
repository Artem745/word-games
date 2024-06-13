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
                    $('#current-category').val(category);
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
        if ($('.end-screen').css('display') !== 'block' && event.key.match(/^[a-zA-Z]$/)) {
            thiss = $('.keyboard-button').filter(function () {
                return $(this).data('letter') === event.key.toUpperCase();
            })
            if (!$(thiss).hasClass('right') && !$(thiss).hasClass('wrong')) {
                keyboard(thiss)
            }
        }
    });

    $(document).on('click', '.hint-button', function () {
        currentLetterDiv = $('.letter-div').filter(function () {
            return $(this).text() === ''
        }).first();
        currentButton = $('.keyboard-button').filter(function () {
            return $(this).data('letter').toLowerCase() === currentLetterDiv.data('letter')
        });
        
        $(currentButton).addClass('shake');
        setTimeout(function() {
            $(currentButton).removeClass('shake');
        }, 1000);
    });
});