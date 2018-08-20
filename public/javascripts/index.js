var g_page = 1;
var g_per_page = 30;

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

            $('.searchable-item').click(function () {
                do_text_search($(this).text(), 1, 20);
            });
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });

    do_text_search('mountain', 1, 20);

});

function get_image_modal(photo_id) {
    $.ajax('api/get_image_modal', {
            data: {
                photo_id: photo_id
            }
        })
        .done(photo_modal => {
            $('#modal-container').html(photo_modal);
            $('#sp-image-modal').modal('show');

            $('.searchable-item').click(function () {
                do_text_search($(this).text(), 1, 20);
                $('#sp-image-modal').modal('hide');
            });
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });
}

function do_text_search(text, page, per_page) {
    g_page = page;
    g_per_page = per_page;
    $.ajax('api/search_by_text', {
            data: {
                text: text,
                page: page,
                per_page: per_page
            }
        })
        .done(photo_list => {
            $('#image-gallery').html(photo_list);

            $('.image-show-button').click(function () {
                let photo_id = $(this).parent().parent().prev().data('id');
                get_image_modal(photo_id);
            });
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });
}

$('#search-text-button').click(function () {
    do_text_search($('#search-text-input').val(), 1, 20);
});

$('.image-show-button').click(function () {
    let photo_id = $(this).parent().parent().prev().data('id');
    get_image_modal(photo_id);
});