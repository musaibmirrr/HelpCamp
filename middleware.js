// joi schema
// The most powerful schema description language and data validator for JavaScript.
const { campgroundSchema, reviewSchema } = require("./schema");
const Campground = require("./models/campground");
const Review = require("./models/review");
const expressError = require("./utils/expressError");
const campground = require("./models/campground");

module.exports.isLoggedIn = (req, res, next) => {
  // to check authenticate, we have a method on request object thanks to passport
  if (!req.isAuthenticated()) {
    // store the url user is requesting
    req.session.returnTo =
      req.method === "DELETE" ? "/campgrounds" : req.originalUrl;
    req.flash("error", "You must be signed In.");
    return res.redirect("/login");
  }
  next();
};
// use the storeReturnTo middleware to save the returnTo value from session to res.locals
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// joi middle ware for reusable code
module.exports.validateCampground = (req, res, next) => {
  // passing our data through to the schema
  // this give us an detailed object about errors and other stuff like value

  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((elm) => elm.message).join(",");
    throw new expressError(message, 400);
  } else {
    next();
  }
};

// middleware for authorization
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author._id.equals(req.user._id)) {
    req.flash("error", "You dont have permission to do that.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You dont have permission to do that.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
// server side validations for review model

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details
      .map((elm) => {
        return elm.message;
      })
      .join(",");
    throw new expressError(message, 400);
  } else {
    next();
  }
};
