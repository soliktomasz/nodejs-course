var mongoose = require('mongoose');

mongoose.PromiseProvider = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};