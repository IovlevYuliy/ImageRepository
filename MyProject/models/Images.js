var mongoose = require('mongoose');

module.exports = mongoose.model('Images',{
    name: String,
    access: String,
    description: String,
    addinfo: String,
    tags: Array(String),
    user: String,
    size: String,
    weight: String
});