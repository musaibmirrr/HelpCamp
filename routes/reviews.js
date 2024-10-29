const express = require('express');
const router = express.Router({ mergeParams: true });
// express routers like to keep params seperate, so we wont have access to the prefix which contains id. So we need to use option mergeparams true.
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviewController = require('../controllers/reviews');




// review route - creating reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview));

// deleting reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;