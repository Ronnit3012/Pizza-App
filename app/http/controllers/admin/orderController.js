const Order = require('../../../models/order');

const orderController = () => {
    return {
        async index(req, res) {
            try {
                const orders = await Order.find({ status: { $ne: 'completed' } },
                    null,
                    { sort: { 'createdAt': -1 } }
                ).populate('customerId', '-password');       // the populate method gets the data of the linked user from the User collection. Hence, it means that the user data will be stored in the customerId field
                // The second parameter to populate is signifying that we dont want that field and hence '-password'

                if(req.xhr) {
                    return res.json(orders);
                }

                return res.render('admin/orders');
            } catch (error) {
                console.log(error);
            }
        },
    }
}

module.exports = orderController;