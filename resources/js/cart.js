import axios from "axios";
import Noty from 'noty';

// const cartCounter = document.querySelector('#cartCounter');

const addCartItem = async (pizza) => {
    try {
        const response = await axios.post('/update-cart', pizza);

        cartCounter.innerText = response.data.totalQty;

        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Order Updated!',
            progressBar: false,
        }).show();

        setTimeout(() => {
            window.location.href = '/cart';
        }, 1000);
    } catch(err) {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong!',
            progressBar: false,
        }).show();
    }
}

const deleteCartItem = async (pizza) => {
    try {
        const response = await axios.post('/delete-item', pizza);

        cartCounter.innerText = response.data.totalQty;

        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Order Updated!',
            progressBar: false,
        }).show();

        setTimeout(() => {
            window.location.href = '/cart';
        }, 1000);

    } catch(err) {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong!',
            progressBar: false,
        }).show();
    }
}

export { addCartItem, deleteCartItem };