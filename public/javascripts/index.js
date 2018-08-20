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
                let per_page = parseInt($('#per-page-input').val());
                do_text_search($(this).text(), 1, per_page);
            });
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });

    do_text_search('mountain', 1, parseInt($('#per-page-input').val()));
});

function get_pagination() {
    $.ajax('api/get_pagination')
        .done(pagination => {
            $('#sp-pagination').html(pagination);

            $('.page-link').click(function () {
                let page = $(this).data('page');
                let per_page = parseInt($('#per-page-input').val());
                let text = $('#search-text-input').val();
                console.log('a.page-link');
                console.log(page);
                console.log(per_page);
                console.log(text);
                do_text_search(text, page, per_page);
            });
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });
}

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
                do_text_search($(this).text(), 1, parseInt($('#per-page-input').val()));
                $('#sp-image-modal').modal('hide');
            });
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });
}

function do_text_search(text, page, per_page) {
    $('#search-text-input').val(text);

    $.ajax('api/search_by_text', {
            data: {
                text: text,
                page: page,
                per_page: per_page,
                sort: $('#sort-by-input').val()
            }
        })
        .done(photo_list => {
            $('#image-gallery').html(photo_list);

            $('.image-show-button').click(function () {
                let photo_id = $(this).parent().parent().prev().data('id');
                get_image_modal(photo_id);
            });

            get_pagination();
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });
}

$('#search-text-button').click(function () {
    let text = $('#search-text-input').val();
    let per_page = parseInt($('#per-page-input').val());
    do_text_search(text, 1, per_page);
});

$('.image-show-button').click(function () {
    let photo_id = $(this).parent().parent().prev().data('id');
    get_image_modal(photo_id);
});