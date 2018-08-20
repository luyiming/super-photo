$(document).ready(function () {
    $.ajax('api/get_top_places', {
            data: {
                total: 10
            }
        })
        .done(places_list => {
            console.log(places_list);
            $('#top-places-spinner').hide();
            $('#top-places-list').append(places_list);
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });
});