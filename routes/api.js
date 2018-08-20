let express = require('express');
let router = express.Router();
let request = require('request');
let flickr = require('../api/flickr');

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
    flickr.search_by_text(req.query.text, req.query.page, req.query.per_page)
        .then(photos => {
            // console.log(JSON.stringify(places));
            res.locals.photos_gallery = photos['photos']['photo'];
            for (let i = 0; i < res.locals.photos_gallery.length; i++) {
                res.locals.photos_gallery[i]['url'] = flickr.get_photo_url(res.locals.photos_gallery[i]);
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
            // console.log(JSON.stringify(info));
            modal_photo = {};
            modal_photo['src'] = flickr.get_photo_url(info['photo']);
            modal_photo['owner'] = info['photo']['owner']['realname'] || info['photo']['owner']['username'];
            modal_photo['title'] = info['photo']['title']['_content'] || 'Photo';

            modal_photo['tags'] = [];

            for (let element of info['photo']['tags']['tag']) {
                modal_photo['tags'].push(element['_content']);
            }

            modal_photo['places'] = [];
            if (info['photo']['location']) {
                if (info['photo']['location']['locality']) {
                    modal_photo['places'].push(info['photo']['location']['locality']['_content']);
                }
                if (info['photo']['location']['region']) {
                    modal_photo['places'].push(info['photo']['location']['region']['_content']);
                }
                if (info['photo']['location']['country']) {
                    modal_photo['places'].push(info['photo']['location']['country']['_content']);
                }
            }

            // console.log(JSON.stringify(modal_photo, null, 2));

            res.render('components/image-modal', {
                modal_photo: modal_photo
            });
        })
        .catch(err => {
            res.sendStatus(404);
        });
});

module.exports = router;