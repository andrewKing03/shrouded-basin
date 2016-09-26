

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema  = new Schema(
    {
  first_name: String,
  last_name: String
});

mongoose.model('users', UserSchema);

