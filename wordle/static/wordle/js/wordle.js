$(document).ready(function() {
    // function getCookie(name) {
    //     let cookieValue = null;
    //     if (document.cookie && document.cookie !== '') {
    //         const cookies = document.cookie.split(';');
    //         for (let i = 0; i < cookies.length; i++) {
    //             const cookie = cookies[i].trim();
    //             if (cookie.substring(0, name.length + 1) === (name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
    // }

    const csrftoken = window.csrfToken;

    $(".category-button").click(function() {
        const length = $(this).data('length'); 
        console.log("Button clicked, length: " + length); 

        $.ajax({
            url: "",  
            type: "GET",
            headers: { 'X-CSRFToken': csrftoken },
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

    function customStart(encryptedId) {
        const length = $(this).data('length'); 
        console.log("Button clicked, length: " + length); 

        $.ajax({
            url: "",  
            type: "GET",
            headers: { 'X-CSRFToken': csrftoken },
            data: { "encrypted_id": encryptedId }, 
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
        })
    };

    if (encryptedId !== null) {
        customStart(encryptedId)
    };

    var user_trying = 0;

    $(document).on('click', '.submit-button', function() {
        let user_answer = [];
        $(".letters-row.active .letters-input").each(function() {
            user_answer.push($(this).val());
        });

        $.ajax({
            url: '/wordle/check_word/', 
            type: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            data: { user_answer: user_answer.join(''), real_word: window.realWord },
            success: function(response) {
                if (response.status === 'success') {
                    $(".letters-row.active .letters-input").each(function(index) {
                        const letter = $(this).val();
                        if (letter) {
                            if (response.letter_status[index] === 'correct') {
                                $(this).css("background-color", "#00d30f");
                                if (!usedLetters.includes(letter)) {
                                    usedLetters.push(letter);
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
                            url: "/wordle/wordle_status/",
                            type: "GET",
                            data: { 'status': 'win' },
                            headers: { 'X-CSRFToken': csrftoken },
                            success: function(response) {
                                if (response.status === 'success') {
                                    console.log("Function is success");
                                    $('.end-screen').css('display', 'block');
                                    $('.end-screen').html(response.update_html);
                                }
                            }
                        });
                    } else {
                        console.log('Слово неправильне!');
                        user_trying += 1;
                        console.log(user_trying);
                        const $currentRow = $('.letters-row.active');
                        const $nextRow = $currentRow.next('.letters-row');

                        if ($nextRow.length) {
                            $currentRow.removeClass('active').find('.letters-input').prop('readonly', true);
                            $nextRow.addClass('active').find('.letters-input').prop('readonly', false);
                            $nextRow.find('.letters-input').first().focus();
                        }

                        if (user_trying >= 5) {
                            $.ajax({
                                url: "/wordle/wordle_status/",
                                type: "GET",
                                data: { 'status': 'lose' },
                                headers: { 'X-CSRFToken': csrftoken },
                                success: function(response) {
                                    if (response.status === 'success') {
                                        console.log("Function is success");
                                        $('.end-screen').css('display', 'block');
                                        $('.end-screen').html(response.update_html);
                                    }
                                }
                            });
                        }
                    }
                } else if (response.status === 'short') {
                    $.ajax({
                        url: "/wordle/wordle_status/",
                        type: "GET",
                        data: { 'status': 'short' },
                        headers: { 'X-CSRFToken': csrftoken },
                        success: function(response) {
                            if (response.status === 'success') {
                                console.log("Function is success");
                                $('.error-screen').css('display', 'block');
                                $('.error-screen').html(response.update_html);
                                $('#exampleModalCenter').modal('show'); // єто если слишком мелкое слово
                            }
                        }
                    });
                    console.error("The word is too short");
                } else if (response.status === "unexist") {
                    $.ajax({
                        url: "/wordle/wordle_status/",
                        type: "GET",
                        data: { 'status': 'unexist' },
                        headers: { 'X-CSRFToken': csrftoken },
                        success: function(response) {
                            if (response.status === 'success') {
                                console.log("Function is success");
                                $('.error-screen').css('display', 'block');
                                $('.error-screen').html(response.update_html);
                                $('#exampleModalCenter').modal('show'); // єто если не корект слово
                            }
                        }
                    });
                    console.error("Word does not exist");
                }
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });

    var usedLetters = []; // Глобальний масив для зберігання використаних літер

    $(document).on('click', '.hint-button', function() {
        $.ajax({
            url: "/wordle/wordle_hint/",
            type: "POST",
            headers: { 'X-CSRFToken': csrftoken },
            data: {
                'hint_letter': JSON.stringify(usedLetters), // Convert array to JSON string
                'real_word': window.realWord
            },
            success: function(response) {
                if (response.status === 'success') {
                    console.log("Hint is " + response.hint);
                    const hintLetter = response.hint;
                    usedLetters.push(hintLetter);

                    const lastActiveRow = $('.letters-row.active');
                    const emptyInput = lastActiveRow.find('.letters-input').filter(function() {
                        return $(this).val() === "";
                    }).first();

                    if (emptyInput.length > 0) {
                        // Find the correct position for the hint letter in the real word
                        const hintIndex = window.realWord.indexOf(hintLetter);
                        lastActiveRow.find('.letters-input').eq(hintIndex).val(hintLetter);
                    } else {
                        console.error("No empty input fields available for hint.");
                    }
                } else {
                    console.error("Error: " + response.message);
                }
            },
            error: function(xhr, errmsg, err) {
                console.error("AJAX error: " + xhr.status + ": " + xhr.responseText);
            }
        });
    });

    $(document).on('keyup', '.letters-input', function(event) {
        const inputVal = $(this).val();
        if (inputVal.length === 1 && inputVal.match(/^[a-zA-Z]{1}$/)) {
            const nextInput = $(this).next('.letters-input');
            if (!nextInput.length) {
                console.log('end');
            } else {
                nextInput.focus();
            }
        }
    });

    $(document).on('keydown', '.letters-input', function(event) {
        if (event.key === 'Backspace' && $(this).val() === '') {
            const prevInput = $(this).prev('.letters-input');
            if (prevInput.length) {
                prevInput.focus();
            }
        }

        if (event.key === "Enter") {
            console.log("enter");
            $('.submit-button').click();
        }
    });
});
