const request = require('request');

var geocodeAddress = (address, callback) => {
    request({
        url: `http://www.mapquestapi.com/geocoding/v1/address?key=HP7GQ0j3qnosRqz0s7x1MAhBF3jQqUIb&location=${encodeURIComponent(address)}`,
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Unable to connect to Google servers.');
        } else if (body.status === 'ZERO_RESULTS') {
            callback('Unable to find that address.');
        } else if (body.info.statuscode === 0) {
            callback(undefined, {
                address:  body.results[0].providedLocation.location,
                latitude: body.results[0].locations[0].latLng.lat,
                longitude: body.results[0].locations[0].latLng.lng
            });            
        } else {
            console.log(JSON.stringify(body, undefined, 2));
        }
    });
};

module.exports.geocodeAddress = geocodeAddress;

