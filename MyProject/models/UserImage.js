var mongoose = require('mongoose');

module.exports = mongoose.model('UserImage',{
    UserId: String,
    ImageId: String
});