const menu = require('../../models/menu');

const homeController = () => {
    return {
        async index(req, res) {
            const pizzas = await menu.find();
            // console.log(pizzas)
            res.render('home', { pizzas });

            // menu.find({}).then(pizzas => {
            //     // console.log(pizzas)
            //     res.render('home', { pizzas });
            // }).catch(err => {
            //     console.log(err)
            // });
        }
    }
}

module.exports = homeController;