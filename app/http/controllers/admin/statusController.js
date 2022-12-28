const Order = require('../../../models/order');

const statusController = () => {
    return {
        async update(req, res) {
            try {
                await Order.updateOne({ _id: req.body.orderId }, { $set: { status: req.body.status } });

                // Emitter
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status });

                return res.redirect('/admin/orders');
            } catch (error) {
                req.flash('error', 'Something went wrong!');
                return res.redirect('/admin/orders');
            }
        }
    }
}

module.exports = statusController;