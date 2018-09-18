const request = require('request');
const yargs = require('yargs');

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

console.log(argv);

request({
    url: `http://www.mapquestapi.com/geocoding/v1/address?key=HP7GQ0j3qnosRqz0s7x1MAhBF3jQqUIb&location=${encodeURIComponent(argv.address)}`,
    json: true
}, (error, response, body) => {
    if (error) {
        console.log('Unable to connect to Google servers.');
    } else if (body.status === 'ZERO_RESULTS') {
        console.log('Unable to find that address.');
    } else if (body.status === 'OK') {
        console.log(`Address: ${body.results[0].providedLocation.location}`);
        console.log(`Latitude: ${body.results[0].locations[0].latLng.lat}`);
        console.log(`Longitude: ${body.results[0].locations[0].latLng.lng}`);
    }
});