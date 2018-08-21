let request = require('request');
let parseString = require('xml2js').parseString;

if (process.env['use_proxy']) {
    request = request.defaults({
        proxy: 'http://127.0.0.1:1087'
    });
}

exports.get_wiki_places = function (place_name) {
    place_name = place_name || 'yosemite';
    console.log('get_wiki_places');
    return new Promise((resolve, reject) => {
        request.get({
            url: 'http://api.geonames.org/wikipediaSearch',
            qs: {
                q: place_name,
                maxRows: 10,
                username: 'eamondovis'
            },
            json: true
        }, (err, res, body) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            parseString(body, function (err, result) {
                // console.log(JSON.stringify(result, null, 2));
                resolve(result['geonames']['entry']);
            });
        });
    });
}

/*
            let x = {
                "lang": [
                    "en"
                ],
                "title": [
                    "Yosemite Falls"
                ],
                "summary": [
                    "Yosemite Falls is the highest waterfall in Yosemite National Park, dropping a total of from the top of the upper fall to the base of the lower fall. Located in the Sierra Nevada of California, it is a major attraction in the park, especially in late spring when the water flow is at its peak.  (...)"
                ],
                "feature": [
                    "landmark"
                ],
                "countryCode": [
                    "US"
                ],
                "elevation": [
                    "1648"
                ],
                "lat": [
                    "37.755"
                ],
                "lng": [
                    "-119.5973"
                ],
                "wikipediaUrl": [
                    "http://en.wikipedia.org/wiki/Yosemite_Falls"
                ],
                "thumbnailImg": [
                    "http://www.geonames.org/img/wikipedia/113000/thumb-112852-100.jpg"
                ],
                "rank": [
                    "92"
                ]
            };
            */