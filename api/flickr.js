let request = require('request');

exports.get_photo_url = function (photo) {
    let farm = photo['farm'];
    let server = photo['server'];
    let secret = photo['secret'];
    let id = photo['id'];
    return 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '_b.jpg'
}

exports.get_top_places = function (count) {
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


exports.get_popular_photos = function (count) {
    /*
    {
        "photos": {
            "page": 2,
            "pages": 1,
            "perpage": 3,
            "total": 3,
            "photo": [{
                    "id": "40730855025",
                    "owner": "38422061@N04",
                    "secret": "a1f48758a4",
                    "server": "936",
                    "farm": 1,
                    "title": "Into the Blue",
                    "ispublic": 1,
                    "isfriend": 0,
                    "isfamily": 0
                },
                {
                    "id": "40653052124",
                    "owner": "38422061@N04",
                    "secret": "ea62342afc",
                    "server": "875",
                    "farm": 1,
                    "title": "Formation",
                    "ispublic": 1,
                    "isfriend": 0,
                    "isfamily": 0
                },
                {
                    "id": "40585865245",
                    "owner": "38422061@N04",
                    "secret": "6d75bfa5c0",
                    "server": "798",
                    "farm": 1,
                    "title": "Fire & Ice",
                    "ispublic": 1,
                    "isfriend": 0,
                    "isfamily": 0
                }
            ]
        },
        "stat": "ok"
    }
    */
    let options = {
        qs: {
            method: 'flickr.photos.getPopular',
            api_key: 'c4637e315af68fc28d9fd128833140cd',
            user_id: '38422061@N04',
            format: 'json',
            nojsoncallback: 1,
            page: 2,
            per_page: count || 3
        },
        proxy: 'http://127.0.0.1:1087',
        json: true
    };
    return new Promise((resolve, reject) => {
        request('https://api.flickr.com/services/rest', options, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

exports.search_by_place_id = function (place_id) {
    let options = {
        qs: {
            method: 'flickr.photos.search',
            api_key: 'c4637e315af68fc28d9fd128833140cd',
            place_id: place_id,
            has_geo: '1',
            format: 'json',
            per_page: 10,
            page: 1,
            nojsoncallback: '1'
        },
        proxy: 'http://127.0.0.1:1087',
        json: true
    };
    /*
    { "photos": { "page": "1", "pages": "944", "perpage": 10, "total": "9438",
    "photo": [
      { "id": "43384198384", "owner": "46929404@N08", "secret": "8930633d8e", "server": "1811", "farm": 2, "title": "365-18-220: Zaporizhian Sich", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "43384197024", "owner": "46929404@N08", "secret": "f85aca944c", "server": "1891", "farm": 2, "title": "365-18-222: Quenching Thirst", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "43338986754", "owner": "68436459@N05", "secret": "52dbc5e283", "server": "1840", "farm": 2, "title": "DSCF4496", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "44057505201", "owner": "68436459@N05", "secret": "9face4b3d0", "server": "1775", "farm": 2, "title": "DSCF4485", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "28832603547", "owner": "68436459@N05", "secret": "d897121bf7", "server": "1812", "farm": 2, "title": "Kitty", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "41960126690", "owner": "68436459@N05", "secret": "4c05ce80b0", "server": "932", "farm": 1, "title": "Snezhinka", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "41960124070", "owner": "68436459@N05", "secret": "36baace2cf", "server": "1817", "farm": 2, "title": "Umbr", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "43052352494", "owner": "68436459@N05", "secret": "88a665feb3", "server": "1820", "farm": 2, "title": "Blackberry 2", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "41960120380", "owner": "68436459@N05", "secret": "8bd7df59dc", "server": "1836", "farm": 2, "title": "Blackberry 1", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "29892526698", "owner": "128795527@N06", "secret": "12f754d8bc", "server": "1832", "farm": 2, "title": "IMG_20180731_113132", "ispublic": 1, "isfriend": 0, "isfamily": 0 }
    ] }, "stat": "ok" }
    */
    return new Promise((resolve, reject) => {
        request('https://api.flickr.com/services/rest', options, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                console.log(body);
                resolve(body);
            }
        });
    });
}