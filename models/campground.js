const mongoose = require('mongoose');
const Review = require('./review');
const { coordinates } = require('@maptiler/client');
// this is just a reference variable
const Schema = mongoose.Schema;

const ImageSchema = new Schema({

    url: String,
    filename: String

});

ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload','/upload/w_200')
});

const opts = { toJSON: { virtuals: true } };


const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
    // geo json format
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    // authorization
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
 });


CampgroundSchema.post('findOneAndDelete', async function (campground) {
    await Review.deleteMany({ _id: { $in: campground.reviews } })
})

module.exports = mongoose.model('Campground', CampgroundSchema);