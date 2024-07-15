$(document).ready(function() {
    const csrftoken = getCookie('csrftoken');
    
    $(".category-button").click(function() {
        const name = $(this).data('name'); 
        console.log("Button clicked, name: " + name); 

        $.ajax({
            url: "",  
            type: "GET",
            headers: { 'X-CSRFToken': csrftoken },
            data: { "name": name }, 
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
});