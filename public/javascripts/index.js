$(document).ready(function () {

    $('#sp-edit-modal-convert-spinner').hide();
    $('#search-button-spinner').hide();

    $('.sp-edit-modal-style-img').click(function () {
        $('.sp-edit-modal-style-img-selected').removeClass('sp-edit-modal-style-img-selected');
        $(this).addClass('sp-edit-modal-style-img-selected');
        $('#sp-edit-modal-style-img-selected').attr('src', $(this).attr('src'));
        $('#sp-edit-modal-style-img-selected').attr('data-style', $(this).attr('data-style'));
    });

    $('#sp-edit-modal-convert').click(function () {
        console.log('convert');
        get_styled_image();
    });

    $.ajax('api/get_top_places', {
            data: {
                total: 20
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

            $('#search-text-button').click(function () {
                let text = $('#search-text-input').val();
                let per_page = parseInt($('#per-page-input').val());
                do_text_search(text, 1, per_page);
            });
        })
        .fail(err => {
            console.log('get_top_places error:');
            console.log(err);
        });

    do_text_search('mountain', 1, parseInt($('#per-page-input').val()));
});

function get_styled_image() {
    $('#sp-edit-modal-convert').addClass('disabled');
    $('#sp-edit-modal-convert-spinner').show();
    $.ajax('api/get_styled_image', {
            data: {
                photo_url: $('#sp-edit-modal-input-img').attr('src'),
                style_id: $('#sp-edit-modal-style-img-selected').data('style')
            }
        })
        .done(styled_photo_url => {
            $('#sp-edit-modal-output-img').attr('src', styled_photo_url);
            $('#sp-edit-modal-convert').removeClass('disabled');
            $('#sp-edit-modal-convert-spinner').hide();
        })
        .fail(err => {
            console.log('get_styled_image error:');
            console.log(err);
            $('#sp-edit-modal-convert').removeClass('disabled');
            $('#sp-edit-modal-convert-spinner').hide();
        });
}

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
    $('.image-show-button').addClass('disabled');
    $('.image-edit-button').addClass('disabled');

    $.ajax('api/get_image_modal', {
            data: {
                photo_id: photo_id
            }
        })
        .done(photo_modal => {
            $('.image-show-button').removeClass('disabled');
            $('.image-edit-button').removeClass('disabled');
            $('#modal-container').html(photo_modal);
            $('#sp-image-modal').modal('show');

            $('.searchable-item').click(function () {
                do_text_search($(this).text(), 1, parseInt($('#per-page-input').val()));
                $('#sp-image-modal').modal('hide');
            });
        })
        .fail(err => {
            $('.image-show-button').removeClass('disabled');
            $('.image-edit-button').removeClass('disabled');
            console.log('get_top_places error:');
            console.log(err);
        });
}

function do_text_search(text, page, per_page) {
    $('#search-text-input').val(text);
    $('#search-button-spinner').show();
    $('#search-text-button').addClass('disabled');

    $.ajax('api/search_by_text', {
            data: {
                text: text,
                page: page,
                per_page: per_page,
                sort: $('#sort-by-input').val(),
                has_geo: $('#has-geo-check').is(":checked") ? 1 : 0,
                in_gallery: $('#in-gallery-check').is(":checked") ? 1 : 0,
            }
        })
        .done(photo_list => {
            $('#image-gallery').html(photo_list);
            $('#search-button-spinner').hide();
            $('#search-text-button').removeClass('disabled');

            $('.image-show-button').click(function () {
                let photo_id = $(this).parent().parent().prev().data('id');
                get_image_modal(photo_id);
            });

            $('.image-edit-button').click(function () {
                $('#sp-edit-modal').modal('show');
                let photo_url = $(this).parent().parent().prev().attr('src');
                photo_url = photo_url.replace('_m.jpg', '_b.jpg');
                $('#sp-edit-modal-input-img').attr('src', photo_url);
            })

            get_pagination();
        })
        .fail(err => {
            $('#search-button-spinner').hide();
            $('#search-text-button').removeClass('disabled');
            console.log('get_top_places error:');
            console.log(err);
        });
}