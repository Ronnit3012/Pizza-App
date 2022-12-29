import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';
import initCart from './cart';
import initAdmin from './admin';

// Socket
const socket = io();
socket.on('connection');

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

// Cart
const orderAreaPath = window.location.pathname;
if(orderAreaPath === '/cart') {
    initCart(socket);
}

// Remove alert message after two seconds
const alertMsg = document.querySelector('#success-alert');
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove();          // this will remove the alert message after 2 seconds
    }, 2000);
}

// Change Order Status
const statuses = document.querySelectorAll('.status-line');
let hiddenInput = document.getElementById('hiddenInput')
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');
time.classList.add('text-sm');

const beforeUpdate = () => {
    statuses.forEach(status => {
        status.classList.remove('step-completed');
        status.classList.remove('current');
    });
}

// Update Order Status
const updateStatus = (order) => {
    beforeUpdate();
    let stepCompleted = true;
    statuses.forEach(status => {
        let dataProp = status.dataset.status;
        if(stepCompleted) {
            status.classList.add('step-completed');
        }

        if(dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            if(status.nextElementSibling) {
                status.nextElementSibling.classList.add('current');
            }
        }
    });
}

updateStatus(order);


// Join Room
if(order) {
    socket.emit('join', `order_${order._id}`);
}

// Admin
const adminAreaPath = window.location.pathname;
if(adminAreaPath.includes('/admin/orders')) {
    initAdmin(socket);
    socket.emit('join', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order };
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    // console.log(updatedOrder);
    updateStatus(updatedOrder);

    // Notification
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order Updated!',
        progressBar: false,
    }).show();
});