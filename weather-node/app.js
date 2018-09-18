const yargs = require('yargs');
const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

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

geocode.geocodeAddress(argv.address, (errorMessage, results) => {
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        console.log(results.address);
        weather.getWeather(results.latitude, results.longitude, (weatherErrorMessage, weatherResults) => {
            if (weatherErrorMessage) {
                console.log(weatherErrorMessage);
            } else {
                console.log(`Current temperature: ${weatherResults.temperature}. RealFeel: ${weatherResults.apparentTemperature}`);
            }
        });
    }
});