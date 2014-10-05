var mongoose = require('mongoose');
var shortId = require('shortid');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  img: { type:String, default: "http://www.emperor-penguin.com/penguin-chick.jpg" },
  first_name: { type: String, required: true },
  last_name: { type:String, required: true },
  email: { type:String, required: true }
});

module.exports = mongoose.model('User', UserSchema);