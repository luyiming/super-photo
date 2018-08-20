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

module.exports = router;