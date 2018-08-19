let request = require('request');

let get_top_places = function get_top_places(count) {

    /*
    place_type_id (Required)
        22: neighbourhood
        7: locality
        8: region
        12: country
        29: continent
    */
    let options = {
        qs: {
            method: 'flickr.places.getTopPlacesList',
            api_key: 'c4637e315af68fc28d9fd128833140cd',
            place_type_id: '8',
            format: 'json',
            nojsoncallback: '1'
        },
        proxy: 'http://127.0.0.1:1087',
        json: true
    };

    return new Promise((resolve, reject) => {
        request('https://api.flickr.com/services/rest', options, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                // resolve(body);
                let total = body['places']['total'];
                let places = body['places']['place'].slice(0, count);
                let date_start = body['places']['date_start']; // unix timestamp
                let date_stop = body['places']['date_stop'];
                let stat = body['stat'];
                // console.log(JSON.stringify(places, null, 2))
                // console.log(total);
                // console.log(date_start);
                // console.log(date_stop);
                // console.log(stat);
                resolve(places);
            }
        });
    });
}

exports.get_top_places = get_top_places;