let express = require('express');
let router = express.Router();
let request = require('request');
let flickr = require('../api/flickr');

router.get('/get_top_places', function (req, res, next) {
    let total = req.query.total || 10;
    flickr.get_top_places(total)
        .then(places => {
            console.log(JSON.stringify(places));
            res.json(places);
        })
        .catch(err => {
            res.sendStatus(404);
        });
});

router.get('/search_by_text', function (req, res) {

});

module.exports = router;