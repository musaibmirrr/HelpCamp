const User = require('../models/user');
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);


        // passport exposes a login function too on req that can be used to establish login session.
        // When the login operation completes, user will be assigned to req.user.
        //Note: passport.authenticate() middleware invokes req.login() automatically.This function is primarily used when users sign up, during which req.login() can be invoked to automatically log in the newly registered user.

        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!',req.user.username);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    // after our app redirects us to where we last time were, we want to delete return to from session but passport js does that on its own after somene logs in it clears the session.
    // So we dont need this manually delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "Goodbye");
        res.redirect('/campgrounds');
    });
};