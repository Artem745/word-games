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

    function customStart(encryptedId) {
        $.ajax({
            type: 'GET',
            url: '/hangman/',
            data: { "category": "Custom", "encrypted_id": encryptedId },
            success: function (response) {
                if (response.status === 'success') {
                    $('.hangman').html(response.update_html);
                    console.log('зашлооо');

                }
            }
        });
    };
    if (encryptedId !== null) {
        customStart(encryptedId);
    };

    function compareLetters(clickedLetter) {
        isCorrect = false;

        $('.letter-div').each(function () {
            var index = $(this).data('index');
            if (word[index].toLowerCase() === clickedLetter.toLowerCase()) {
                $(this).text(clickedLetter);
                isCorrect = true;
            };
        });
        return isCorrect;
    }

    function keyboard(thiss) {

        var clickedLetter = thiss.data('letter');

        if (compareLetters(clickedLetter)) {
            thiss.addClass('right')

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
            errors = Number(errors);
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
    // Для игровой клавіатури
    $(document).on('click', '.keyboard-button', function () {
        keyboard($(this));
    });

    // Для обічной клавіатури
    $(document).on('keypress', function (event) {
        if ($('.end-screen').css('display') !== 'block' && event.key.match(/^[a-zA-Z]$/)) {
            var thiss = $('.keyboard-button').filter(function () {
                return $(this).data('letter') === event.key.toUpperCase();
            });
            if (!$(thiss).hasClass('right') && !$(thiss).hasClass('wrong')) {
                keyboard(thiss);
            }
        }
    });

    $(document).on('click', '.hint-button', function () {
        if (hints) {
            hints -= 1;
            currentLetterDiv = $('.letter-div').filter(function () {
                return $(this).text() === ''
            }).first();
            currentLetter = word[currentLetterDiv.data('index')]
            currentButton = $('.keyboard-button').filter(function () {
                return $(this).data('letter').toLowerCase() === currentLetter
            });
            
            $('.hint-text').text(hints)

            $(currentButton).addClass('shake');
            setTimeout(function() {
                $(currentButton).removeClass('shake');
            }, 1000);
        }
    });
});