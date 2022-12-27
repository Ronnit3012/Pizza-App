const Order = require('../../../models/order');
const moment = require('moment');

const orderController = () => {
    return {
        async index(req, res) {
            try {
                const orders = await Order.find({ customerId: req.user._id }, 
                    null, 
                    { sort: { 'createdAt': -1 }}        // this will sort the orders in descneding order on the basis of createdAt field
                );

                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');    // this removes cache to not to get stored on back button

                return res.render('customers/orders', { orders, moment });   // we will also pass moment here
                // Moment is used to format into various types so here we are only using it for time
            } catch (err) {
                console.log(err);
            }
        },
        async store(req, res) {
            const { phone, address } = req.body;
            // Validate request
            if(!phone || !address) {
                req.flash('error', 'All fields are required!');
                return res.redirect('/cart');
            };
            
            console.log(req.session.cart.items)
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address,
            });

            try {
                await order.save();

                req.flash('success', 'Order placed successfully!');
                delete req.session.cart;        // this will delete all the items stored in the cart will be deleted because they are all placed

                return res.redirect('/customer/orders');
            } catch(err) {
                req.flash('error', 'Something went wrong!');
                return res.redirect('/cart');
            }
        }
    }
}

module.exports = orderController;