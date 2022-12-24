const cartController = () => {
    return {
        index(req, res) {
            res.render('customers/cart');
        },
        // update cart in the session
        update(req, res) {
            // console.log(req.session)
            // console.log(req.body)
            
            // For first time creating the cart (if the cart is empty) and adding basic object structure
            if(!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0,
                }
            }

            // Creating an instance of the cart stored in the session
            const cart = req.session.cart;

            // If the selected item is not in the cart
            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
            } else {
                cart.items[req.body._id].qty += 1
            }

            cart.totalQty += 1;
            cart.totalPrice += req.body.price;

            return res.json({ totalQty: req.session.cart.totalQty });
        }
    }
}

module.exports = cartController;