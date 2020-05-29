//loggedIn() middleware checks if user is logged in and if so,
//redirects the user to the profile page if the user tries to access
//the login or register page
function loggedIn(req,res,next) {
    if (req.session && req.session.userId) {
        return res.redirect('/profile')
    }
    next();
}



//requiresLogin() middleware is used on routes to be protected
//and a user must be logged in to view the resource from those routes
function requiresLogin(req,res,next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in');
        err.status = 401;
        next(err);
    }
}

module.exports.loggedIn = loggedIn;
module.exports.requiresLogin = requiresLogin;