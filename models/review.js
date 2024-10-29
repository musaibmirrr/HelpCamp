// reviews model here
const mongoose = require('mongoose');

const { Schema } = mongoose;

// we will connect reviews with campground. Its one to many relationship, so embed array of object id's in campground model..

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    isFake : Boolean,
    polarity : Number
});

module.exports = mongoose.model('Review', ReviewSchema);