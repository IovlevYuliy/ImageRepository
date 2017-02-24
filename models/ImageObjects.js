var mongoose = require('mongoose');

module.exports = mongoose.model('ImageObjects',{
    imageId: String,
    objects: String
});