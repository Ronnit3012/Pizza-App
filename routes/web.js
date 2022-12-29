const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');

// Middlewares
const guest = require('../app/http/middlewares/guest');     // restricts authenticated user from visiting pages('login' and 'register')
const auth = require('../app/http/middlewares/auth');     // restricts unauthenticated user from visiting pages('customer/orders')
const admin = require('../app/http/middlewares/admin');   // allows authenticated admin user to visit pages('admin/orders')

const initRoutes = (app) => {
    app.get('/', homeController().index);

    app.get('/login', guest, authController().login);
    app.post('/login', authController().postLogin);

    app.get('/register', guest, authController().register);
    app.post('/register', authController().postRegister);

    app.post('/logout', authController().logout);

    app.get('/cart', cartController().index);
    app.post('/update-cart', cartController().update);
    app.post('/delete-item', cartController().deleteItem);

    // Customer routes
    app.post('/orders', auth, orderController().store);
    app.get('/customer/orders', auth, orderController().index);
    app.get('/customer/orders/:id', auth, orderController().show);     // we make dynamic routes for each orderId

    // Admin routes
    app.get('/admin/orders', admin, adminOrderController().index);
    app.post('/admin/order/status', admin, statusController().update);
}

module.exports = initRoutes;