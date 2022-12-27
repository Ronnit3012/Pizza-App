const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,   // We are linking customerId to customer's login Id in the user's collection
        ref: 'User',
        required: true,
    },
    items: {        // we will extract it from the session
        type: Object,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    paymentType: {
        type: String,
        default: 'COD',
    },
    status: {
        type: String,
        default: 'order_placed',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);