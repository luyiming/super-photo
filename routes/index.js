let express = require('express');
let router = express.Router();
let request = require('request');
let flickr = require('../api/flickr');
let deep = require('../api/deep-art-effects');

/* GET home page. */
router.get('/', function (req, res, next) {
  flickr.get_popular_photos(3)
    .then(photos => {
      // console.log(JSON.stringify(photos, null, 2));
      let carousel = [];
      for (let i = 0; i < 3; i++) {
        carousel.push(flickr.get_photo_url(photos['photos']['photo'][i]));
      }
      res.locals.carousel = carousel;

      deep.get_all_styles().then(styles => {
        res.locals.styles = styles;
        res.render('index');
      });

    });
});

module.exports = router;