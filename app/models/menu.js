// the convention is the model should be singular and the collection name should be plural
const mongoose = require('mongoose');
const Schema = mongoose.Schema;   // if the method starts with a capital letter then it means it is returning a class or a constructor

const menuSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Menu', menuSchema);
// If we insert the a document ina collection which does not exist in the db then the db will create the collection with name as plural of first argument passed (Here 'Menu' so 'menus')