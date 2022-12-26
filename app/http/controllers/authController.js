const User = require('../../models/user');
const bcrypt = require('bcrypt');
const user = require('../../models/user');

const authController = () => {
    return {
        login(req, res) {
            res.render('auth/login')
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
            console.log(req.body);
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
                console.log(response);

                return res.redirect('/');
            } catch (err) {
                req.flash('error', 'Something went wrong!');

                return res.redirect('/register');
            }
        }
    }
}

module.exports = authController;