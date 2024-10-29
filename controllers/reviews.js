const Review = require('../models/review');
const Campground = require('../models/campground');

const analyzePolarity = require('../sentiment')

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    // req.body.review means all our body will be under key review
    const review = new Review(req.body.review);
    review.author = req.user._id;

    const polarity = analyzePolarity.analyzePolarity(review);

    if (polarity >= 3) {
        review.isFake = true
        review.polarity = polarity
    } else if (polarity <= -3) {
        review.isFake = true
        review.polarity = polarity
    } else if (polarity > -3 && polarity < 3) {
        review.isFake = false
        review.polarity = polarity
    }

    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review!');
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    // $pull
    // The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/campgrounds/${id}`);
};