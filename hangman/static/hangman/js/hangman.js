$(document).ready(function () {
    $(".category-item").click(function () {
        var category = $(this).data('category');
        console.log(category);
        $.ajax({
            type: 'GET',
            url: '/hangman/',
            data: { "category": category },
            success: function (response) {
                if (response.status === 'success') {
                    $('.word-container').html(response.word_html);
                } else {
                    console.error('Error');
                }
            }
        });
    });
});