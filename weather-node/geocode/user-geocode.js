const axios = require('axios');

var userTemp = () => {
    axios.get('https://api.ipify.org?format=json').then((response) => {
        return axios.get(`http://api.ipstack.com/${response.data.ip}?access_key=3e444b7809b490cc032d74c33771a36e`);
    }).then((response) => {
        var latitude = response.data.latitude;
        var longitude = response.data.longitude;
        var weatherURL = `https://api.darksky.net/forecast/162cd468216b29fe8e73247f6c529a3f/${latitude},${longitude}?units=auto`;
        console.log(`User location: ${response.data.city}, ${response.data.country_name}`)
        return axios.get(weatherURL);
    }).then((response) => {
        var temperature = response.data.currently.temperature;
        var apparentTemperature = response.data.currently.apparentTemperature;
        console.log(`It's currently: ${temperature}. Feels like: ${apparentTemperature}.`);
    }).catch((err) => {
        console.log(err);
    });
};

module.exports.userTemp = userTemp;