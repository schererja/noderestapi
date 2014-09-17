// app/models/message.js
//
// Basic Model for message
//

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    message_s: String
});

module.exports = mongoose.model('Message', MessageSchema);