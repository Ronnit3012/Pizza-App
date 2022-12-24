const menu = require('../../models/menu');

const homeController = () => {
    return {
        async index(req, res) {
            // const pizzas = await menu.find().select({_id: 0});       // to remove id from the response to find()
            const pizzas = await menu.find();

            res.render('home', { pizzas });
        }
    }
}

module.exports = homeController;