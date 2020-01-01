var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new mongoose.Schema({
	username: String,
    password: String,
    pinCode:Number
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);

// const mongoose = require('mongoose');

// const user_Schema = mongoose.Schema(
//     {
//         name:String,
        
//     }
// );

// module.exports = mongoose.model("User",user_Schema);