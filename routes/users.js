const express = require('express');
const router = express.Router()
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const userController = require('../controllers/users');

router.route('/register')
    // in here using passport we register a user and catch errors manually to flash them rather giving control to default error handler.
    .get(userController.renderRegister)
    .post(catchAsync(userController.register))

router.route('/login')
    // using passport to login user

    .get(userController.renderLogin)

    // here we will use passport method authenticate which expects a strategy to be passed in and options

    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login)


// Now lets add in logout functionality and via passport on our req object we have access to login and logout methods.
router.get('/logout', userController.logout);

module.exports = router;
