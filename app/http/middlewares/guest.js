const guest = (req, res, next) => {
    if(!req.isAuthenticated()) {        // we get this method with the help of passport to check if the user is authenticated or not
        return next();
    }

    return res.redirect('/');
}

module.exports = guest;