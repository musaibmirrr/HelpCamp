const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');

// requiring controllers
const campgroundController = require('../controllers/campgrounds');

const passport = require('passport');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
// Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


// router.route a single route that handles multiple routes, a fancy restructure.

router.route('/')
    .get(catchAsync(campgroundController.index))
    // multer middleware will parse multipart form data and
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundController.createCampground))

router.get('/new', isLoggedIn, campgroundController.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm));

module.exports = router;