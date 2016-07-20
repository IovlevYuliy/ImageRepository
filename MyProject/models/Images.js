var mongoose = require('mongoose');

module.exports = mongoose.model('Images',{
    name: String,
    link: String
});