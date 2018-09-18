const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=HP7GQ0j3qnosRqz0s7x1MAhBF3jQqUIb&location=${encodedAddress}`;

axios.get(geocodeUrl).then((response) => {
    if (response.data.info.statuscode === 400) {
        throw new Error(response.data.info.messages[0]);
    }
    
    var latitude = response.data.results[0].locations[0].latLng.lat;
    var longitude = response.data.results[0].locations[0].latLng.lng;
    var weatherURL = `https://api.darksky.net/forecast/162cd468216b29fe8e73247f6c529a3f/${latitude},${longitude}`;
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