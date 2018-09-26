var mongoose = require('mongoose');

mongoose.PromiseProvider = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};