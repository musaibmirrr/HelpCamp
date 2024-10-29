const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

// we want to implement auth using passport
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true //if validation middleware is there this will not be there, it just sets index
    }
});

// Passport - Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
// Additionally, Passport - Local Mongoose adds some methods to your Schema.See the API Documentation section for more details.
userSchema.plugin(passportLocalMongoose);

// now we need to configure our app to use passport
module.exports = mongoose.model('User', userSchema);



