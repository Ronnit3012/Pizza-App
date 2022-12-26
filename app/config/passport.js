const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

const init = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        //Login
        // Check if email exists
        const user = await User.findOne({ email });
        if(!user) {
            return done(null, false, { message: 'No user with this email' });
        }

        // Check passwords
        try {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if(passwordMatch) {
                return done(null, user, { message: 'Logged in successfully' });
            }

            return done(null, false, { message: 'Wrong username or password' });
        } catch(err) {
            return done(null, false, { message: 'Something went wrong' });
        }
    }));

    // To store the unique value of the user in the session
    passport.serializeUser((user, done) => {
        // the serializeUser method on passport allows us to store any unique value which will distinguish the user from others in the session
        done(null, user._id);
    });

    // To get the data what we stored in the session
    passport.deserializeUser((id, done) => {
        // The deserializeUser method adds the property on the request object as user(req.user)
        try {
            const user = User.findById(id);
            done(null, user);
        } catch(err) {
            done(err, false);
        }
    });
}

module.exports = init;