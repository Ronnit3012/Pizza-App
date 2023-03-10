const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const authController = () => {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders';
    }

    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next) {
            const { email, password } = req.body;
            
            let cart;
            if(req.session.cart) {
                cart = req.session.cart;
            }

            // Validate Request
            if(!email || !password) {
                req.flash('error', 'All fields are required!');

                return res.redirect('/login');
            }

            // Authenticate User
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message);
                    return next(err);
                }
                if(!user) {
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }
                
                req.logIn(user, err => {        // we get this method with the help of passport
                    if(err) {
                        req.flash('error', info.message);
                        return next(err);
                    }

                    if(cart) {
                        req.session.cart = cart;
                    }

                    return res.redirect(_getRedirectUrl(req));      // we will create a private method which will return the route to redirect based in the role of the user
                });
            })(req, res, next);
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
            // console.log(req.body);
            const { name, email, password } = req.body;
            
            try {
                // Validate Request
                if(!name || !email || !password) {
                    // the flash messages are visible on that page if we redirect to the same page as response
                    req.flash('error', 'All fields are required!');     // if any of the input field is empty then we use flash to send error message back as response

                    // sending back all the received data back
                    req.flash('name', name);
                    req.flash('email', email);
                    // we didn't send password back because if password does not gets approved by the validation it removes empties the input field

                    return res.redirect('/register');       // we redirect it to the same page
                }

                // Check if email exists
                const checkEmail = await User.exists({ email: email });
                if(checkEmail) {
                    req.flash('error', 'Email already taken!');

                    req.flash('name', name);
                    req.flash('email', email);

                    return res.redirect('/register');
                }

                // Hash password
                const hashedPasword = await bcrypt.hash(password, 10);

                // Create User
                const user = new User({
                    name,
                    email,
                    password: hashedPasword,
                });

                const response = await user.save();
                // console.log(response);

                return res.redirect('/login');
            } catch (err) {
                req.flash('error', 'Something went wrong!');

                return res.redirect('/register');
            }
        },
        logout(req, res, next) {
            req.logout((err) => {
                if(err) {
                    return next(err);
                }

                return res.redirect('/login')
            });
        },
    }
}

module.exports = authController;