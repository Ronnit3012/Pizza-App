const Order = require('../../../models/order');
const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_PAYMENT_KEY);

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
            const { phone, address, stripeToken, paymentType = null } = req.body;
            
            // Validate request
            if(!phone || !address) {
                // req.flash('error', 'All fields are required!');
                // return res.redirect('/cart');
                return res.json({ error: 'All fields are required!' });
            };
            
            // console.log(req.session.cart.items)
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address,
                paymentType,
            });

            try {
                const result = await order.save();

                try {
                    const orderPlaced = await Order.populate(result, { path: 'customerId' });

                    // Stripe Payment
                    if(paymentType === 'card') {
                        // console.log(req.session.cart.totalPrice * 100);
                        // console.log(stripeToken);
                        // console.log(orderPlaced);
                        try {
                            await stripe.charges.create({
                                amount: req.session.cart.totalPrice * 100,
                                source: stripeToken,
                                currency: 'usd',
                                description: `Pizza order: ${orderPlaced._id}`,
                            });

                            orderPlaced.placedStatus = true;

                            try {
                                const ord = await orderPlaced.save();

                                // Emit 
                                const eventEmitter = req.app.get('eventEmitter');
                                eventEmitter.emit('orderPlaced', ord);

                                delete req.session.cart;        // this will delete all the items stored in the cart will be deleted because they are all placed

                                return res.json({ success: 'Payment successful, Order placed successfully!' });
                            } catch (error) {
                                return res.json({ error: 'Payment successful but order not placed!' });
                            }
                        } catch (error) {
                            delete req.session.cart;        // this will delete all the items stored in the cart will be deleted because they are all placed

                            return res.json({ error: 'Order placed but payment failed, You can pay at delivery time!' });
                        }
                    }

                    // Emit 
                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderPlaced', orderPlaced);

                    delete req.session.cart;        // this will delete all the items stored in the cart will be deleted because they are all placed

                    return res.json({ success: 'Order placed successfully!' });
                    // return res.redirect('/customer/orders');
                } catch (error) {
                    console.log(error);
                }
            } catch(err) {
                // req.flash('error', 'Something went wrong!');
                // return res.redirect('/cart');
                return res.status(500).json({ error: 'Something went wrong!' });
            }
        },
        async show(req, res) {
            try {
                const order = await Order.findById(req.params.id);

                // Authorize user
                if(req.user._id.toString() === order.customerId.toString()) {
                    return res.render('customers/singleOrder', { order, moment });
                }

                return res.redirect('/')
            } catch(err) {
                req.flash('error', 'Something went wrong!');
                return res.redirect('/customer/orders');
            }
        }
    }
}

module.exports = orderController;