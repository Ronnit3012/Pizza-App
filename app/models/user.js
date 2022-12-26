const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {       // we don't keep this field required because we don't want admin to register himself. Hence we will do it manually
            type: String,
            default: 'customer',    // Now we keep the default value as customer so that whenever a customer registes no need to modify but when admin registers we will modify it manually
        }
    }, {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);