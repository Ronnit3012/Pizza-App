import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';
import initAdmin from './admin';

const addToCart = document.querySelectorAll('.add-to-cart');
const cartCounter = document.querySelector('#cartCounter');

const updateCart = async (pizza) => {
    // Here we will send a request to the server for updating the cart
    // We will use axios
    try {
        const response = await axios.post('/update-cart', pizza);

        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart!',
            progressBar: false,
        }).show();

        cartCounter.innerText = response.data.totalQty;
    } catch(err) {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong!',
            progressBar: false,
        }).show();
    }
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
    });
});


// Remove alert message after two seconds
const alertMsg = document.querySelector('#success-alert');
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove();          // this will remove the alert message after 2 seconds
    }, 2000);
}

initAdmin();