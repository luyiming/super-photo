let express = require('express');
let router = express.Router();
let request = require('request');
let flickr = require('../api/flickr');
let deep = require('../api/deep-art-effects');
let wiki_api = require('../api/wiki');

var g_page = 1;
var g_pages = 30;

router.get('/get_top_places', function (req, res, next) {
    let total = req.query.total || 10;
    flickr.get_top_places(total)
        .then(places => {
            // console.log(JSON.stringify(places));
            res.render('components/top-places-widget-list', {
                places: places
            });
        })
        .catch(err => {
            res.sendStatus(404);
        });
});

router.get('/search_by_text', function (req, res) {
    flickr.search_by_text(req.query.text, req.query.page, req.query.per_page, req.query.sort, req.query.has_geo, req.query.in_gallery)
        .then(photos => {
            // console.log(JSON.stringify(photos));

            g_page = photos['photos']['page'];
            g_pages = photos['photos']['pages'];

            res.locals.photos_gallery = photos['photos']['photo'];
            for (let i = 0; i < res.locals.photos_gallery.length; i++) {
                res.locals.photos_gallery[i]['url'] = flickr.get_photo_url_small(res.locals.photos_gallery[i]);
            }
            res.render('components/image-card-list');
        })
        .catch(err => {
            res.sendStatus(404);
        });
});

router.get('/get_image_modal', function (req, res) {
    flickr.get_photo_info(req.query.photo_id)
        .then(info => {
            // console.log(JSON.stringify(info, null, 2));
            modal_photo = {};
            modal_photo['src'] = flickr.get_photo_url(info['photo']);
            modal_photo['owner'] = info['photo']['owner']['realname'] || info['photo']['owner']['username'];
            modal_photo['title'] = info['photo']['title']['_content'] || 'Photo';
            modal_photo['photo_src'] = info['photo']['urls'] ? info['photo']['urls']['url'][0]['_content'] : undefined;

            modal_photo['tags'] = [];

            for (let element of info['photo']['tags']['tag']) {
                modal_photo['tags'].push(element['_content']);
            }

            modal_photo['places'] = [];
            if (info['photo']['location']) {
                if (info['photo']['location']['locality']) {
                    modal_photo['places'].push(info['photo']['location']['locality']['_content']);
                }
                if (info['photo']['location']['county']) {
                    modal_photo['places'].push(info['photo']['location']['county']['_content']);
                }
                if (info['photo']['location']['region']) {
                    modal_photo['places'].push(info['photo']['location']['region']['_content']);
                }
                if (info['photo']['location']['country']) {
                    modal_photo['places'].push(info['photo']['location']['country']['_content']);
                }
            }

            // console.log(JSON.stringify(modal_photo, null, 2));
            if (modal_photo['places'].length > 0) {
                wiki_api.get_wiki_places(modal_photo['places'][0])
                    .then(wiki_places => {
                        // console.log(JSON.stringify(wiki_places,null,2));
                        res.render('components/image-modal', {
                            modal_photo: modal_photo,
                            wiki_places: wiki_places
                        });
                    })
                    .catch(err => {
                        res.render('components/image-modal', {
                            modal_photo: modal_photo,
                        });
                    });
            } else {
                res.render('components/image-modal', {
                    modal_photo: modal_photo,
                });
            }
        })
        .catch(err => {
            res.sendStatus(404);
        });
});

router.get('/get_pagination', function (req, res) {
    // console.log(g_page);
    // console.log(g_pages);

    let page = [];
    for (let i = 10; i > 0; i--) {
        if (g_page - i > 0) {
            page.push(g_page - i);
        }
    }
    page.push(g_page);
    for (let i = 1; i < 10; i++) {
        if (g_page + i <= g_pages) {
            page.push(g_page + i);
        }
    }

    page = page.slice(page.indexOf(g_page) - 3 >= 0 ? page.indexOf(g_page) - 3 : 0);
    page = page.slice(0, 7);

    while (page.length < 7) {
        if (page[0] == 1) {
            break;
        }
        page.unshift(page[0] - 1);
    }

    res.render('components/pagination', {
        pages_info: {
            pages: page,
            current: g_page,
            total: g_pages,
        }
    })
});

router.get('/get_styled_image', function (req, res) {

    deep.transform(req.query.photo_url, req.query.style_id)
        .then(output_url => {
            console.log('get_styled_image: output ', output_url);
            res.send(output_url);
            res.end();
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(404);
        });
});

module.exports = router;