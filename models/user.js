var mongoose         = require("mongoose"),
    passportLocalMon = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMon);

module.exports = mongoose.model("User", UserSchema);