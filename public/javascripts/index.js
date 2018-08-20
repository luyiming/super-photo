$(document).ready(function () {
    $.ajax('api/get_top_places', {
            data: {
                total: 10
            }
        })
        .done(places_list => {
            // console.log(places_list);
            $('#top-places-spinner').hide();
            $('#top-places-list').append(places_list);
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });
});

$('#search-text-button').click(function () {
    $.ajax('api/search_by_text', {
        data: {
            text: $('#search-text-input').val(),
            page: 1,
            per_page: 20
        }
    })
    .done(photo_list => {
        // console.log(photo_list);
        $('#image-gallery').html(photo_list);
    })
    .fail(err => {
        console.log('get_top_places error:');
        console.log(err);
    });

});