$(document).ready(function() {
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    $(".category-button").click(function () {
        var length = $(this).data('length'); 
        console.log("Button clicked, length: " + length); 

        $.ajax({
            url: "",  
            type: "GET",
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: { "length": length }, 
            success: function(response) {
                if (response.status === 'success') {
                    $('.content').html(response.update_html);
                    window.realWord = response.real_word; 
                } else {
                    console.error("Error: " + response.message); 
                }
            },
            error: function(xhr, errmsg, err) {
                console.error("AJAX error: " + xhr.status + ": " + xhr.responseText); 
            }
        });
    });

    $(document).ready(function() {
        var user_trying = 0; 

        $(document).on('click', '.submit-button', function () {
            var user_answer = [];
            $(".letters-row.active .letters-input").each(function() {
                user_answer.push($(this).val());
            });
        
            $.ajax({
                url: 'check_word/', 
                type: 'POST',
                headers: { 'X-CSRFToken': csrftoken },
                data: { user_answer: user_answer.join(''), real_word: window.realWord },
                success: function(response) {
                    if (response.status === 'success') {
                        $(".letters-row.active .letters-input").each(function(index) {
                            var letter = $(this).val();
                            if (letter) {
                                if (response.letter_status[index] === 'correct') {
                                    $(this).css("background-color", "#00d30f");
                                    if (!usedLetters.includes(letter)) {
                                        usedLetters.push(letter); // Додаємо літеру до списку, якщо вона не була додана раніше
                                    }
                                } else if (response.letter_status[index] === 'present') {
                                    $(this).css("background-color", "yellow");
                                } else {
                                    $(this).css("background-color", "red");
                                }
                            }
                        });
        
                        if (response.is_correct) {
                            console.log('Слово правильне!');
                            $.ajax({
                                url: "wordle_status/",
                                type: "GET",
                                data: { 'status': 'win' },
                                headers: {
                                    'X-CSRFToken': csrftoken
                                },
                                success: function (response) {
                                    if (response.status === 'success') {
                                        console.log("Function is success")
                                        $('.end-screen').css('display', 'block');
                                        $('.end-screen').html(response.update_html);
                                        $('#exampleModalCenter').modal('show');
                                    }

                                }
                            })
                        } else {
                            console.log('Слово неправильне!');
                            user_trying += 1
                            console.log(user_trying)
                            var $currentRow = $('.letters-row.active');
                            var $nextRow = $currentRow.next('.letters-row');
        
                            if ($nextRow.length) {
                                $currentRow.removeClass('active').find('.letters-input').prop('readonly', true);
                                $nextRow.addClass('active').find('.letters-input').prop('readonly', false);
                                $nextRow.find('.letters-input').first().focus();
                                
                            }
                        } if (user_trying >= 5){
                            $.ajax({
                                url: "wordle_status/",
                                type: "GET",
                                data: { 'status': 'lose' },
                                headers: {
                                    'X-CSRFToken': csrftoken
                                },
                                success: function (response) {
                                    if (response.status === 'success') {
                                        console.log("Function is success")
                                        $('.end-screen').css('display', 'block');
                                        $('.end-screen').html(response.update_html);
                                        $('#exampleModalCenter').modal('show');
                                    }

                                }
                            })
                        }
                            
                    } else if (response.status === 'short') {
                        $.ajax({
                            url: "wordle_status/",
                            type: "GET",
                            data: { 'status': 'short' },
                            headers: {
                                'X-CSRFToken': csrftoken
                            },

                            success: function (response) {
                                if (response.status === 'success') {
                                    console.log("Function is success")
                                    $('.error-screen').css('display', 'block');
                                    $('.error-screen').html(response.update_html);
                                    $('#exampleModalCenter').modal('show');
                                }

                            }
                        })
                        console.error("the word is too short");
                    } else if (response.status === "unexist") {
                        $.ajax({
                            url: "wordle_status/",
                            type: "GET",
                            data: { 'status': 'unexist' },
                            headers: {
                                'X-CSRFToken': csrftoken
                            },

                            success: function (response) {
                                if (response.status === 'success') {
                                    console.log("Function is success")
                                    $('.error-screen').css('display', 'block');
                                    $('.error-screen').html(response.update_html);
                                    $('#exampleModalCenter').modal('show');
                                }

                            }
                        })
                        console.error("word does not exist");
                    }
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        });
    });
    
    var usedLetters = []; // Глобальний масив для зберігання використаних літер

    $(document).on('click', '.hint-button', function () {
    $.ajax({
        url: "wordle_hint/",
        type: "POST",
        headers: {
            'X-CSRFToken': csrftoken
        },
        data: { 'hint_letter': usedLetters, 'real_word' : realWord }, // Відправка вибраної літери на сервер
        success: function (response) {
            if (response.status === 'success') {
                console.log("Hint is " + response.hint);
        
                // Отримання позиції підказаної літери у слові
                var hintLetter = response.hint;
                var position = realWord.indexOf(hintLetter);
        
                // Отримання останнього ряду з пустими input полями
                var lastEmptyRow = $('.letters-row').last();
        
                // Отримання першого пустого input поля у останньому ряду
                var emptyInput = lastEmptyRow.find('.letters-input[value=""]');
    
                emptyInput.first().val(hintLetter);
            } else {
                console.error("Error: " + response.message);
            }
        },
        error: function (xhr, errmsg, err) {
            console.error("AJAX error: " + xhr.status + ": " + xhr.responseText);
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
    });

    $(document).on('keydown', '.letters-input', function (event) {
        if (event.key === 'Backspace' && $(this).val() === '') {
            var prevInput = $(this).prev('.letters-input');
            if (prevInput.length) {
                prevInput.focus();
            }
        }
    
        if (event.key === "Enter") {
            console.log("enter");
            $('.submit-button').click(); // Симулюємо клік на кнопку "submit"
        }
    });
    
});

