const yargs = require('yargs');
const axios = require('axios');
const userGeocode = require('./geocode/user-geocode');

const argv = yargs
    .options({
        a: {
            demand: false,
            alias: 'address',
            describe: 'Address to fetch weather for location',
            string: true
        },
        u: {
            demand: false,
            alias: 'user',
            describe: 'Get weather for current user location',
            type: 'boolean'
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

if (argv.address !== '' && argv.address !== undefined) {
    var encodedAddress = encodeURIComponent(argv.address);
    var geocodeUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=HP7GQ0j3qnosRqz0s7x1MAhBF3jQqUIb&location=${encodedAddress}`;

    axios.get(geocodeUrl).then((response) => {
        if (response.data.info.statuscode === 400) {
            throw new Error(response.data.info.messages[0]);
        }

        var latitude = response.data.results[0].locations[0].latLng.lat;
        var longitude = response.data.results[0].locations[0].latLng.lng;
        var weatherURL = `https://api.darksky.net/forecast/162cd468216b29fe8e73247f6c529a3f/${latitude},${longitude}?units=auto`;
        console.log(response.data.results[0].providedLocation.location);
        return axios.get(weatherURL);
    }).then((response) => {
        var temperature = response.data.currently.temperature;
        var apparentTemperature = response.data.currently.apparentTemperature;
        console.log(`It's currently: ${temperature}. Feels like: ${apparentTemperature}.`);
    }).catch((e) => {
        if (e.code === 'ENOTFOUND') {
            console.log("Unable to connect to API server");
        } else {
            console.log(e.message);
        }
    });
} else if (argv.user) {
    userGeocode.userTemp();
}