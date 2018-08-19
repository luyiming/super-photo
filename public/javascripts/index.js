$(document).ready(function () {
    $.ajax('api/get_top_places', {
            data: {
                total: 100
            }
        })
        .done(places => {
            console.log(places);
            $('#top-places-spinner').hide();
            for (const place of places) {
                if (place['photo_count'] > 1000) {
                    $('#top-places-list').append('<li class="list-group-item d-flex justify-content-between align-items-center py-1"><a href="#">' + place['woe_name'] + '</a><span class="badge badge-primary badge-pill">' + place['photo_count'] + '</span></li>');
                } else {
                    $('#top-places-list').append('<li class="list-group-item d-flex justify-content-between align-items-center py-1"><a href="#">' + place['woe_name'] + '</a><span class="badge badge-secondary badge-pill">' + place['photo_count'] + '</span></li>');
                }
            }
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });
});