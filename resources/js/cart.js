import axios from "axios";
import Noty from 'noty';
import initStripe from "./stripe";

const cartCounter = document.querySelector('#cartCounter');

const eventListeners = () => {
    //Stripe
    initStripe();
    
    // Add and Delete Item
    const addItemButtons = document.querySelectorAll('.addItem');
    const removeItemButtons = document.querySelectorAll('.removeItem');

    addItemButtons.forEach(addItem => {
        addItem.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(addItem.dataset.pizza);
            let pizza = JSON.parse(addItem.dataset.pizza);
            addCartItem(pizza);
        });
    });

    removeItemButtons.forEach(removeItem => {
        removeItem.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(removeItem.dataset.pizza)
            let pizza = JSON.parse(removeItem.dataset.pizza);
            deleteCartItem(pizza);
        })
    });
}

const authenticatedUser = (user) => {
    if(!user) {
        return `
            <a href="/login" class="inline-block cursor-pointer btn-primary px-6 py-2 rounded-full text-white font-bold mt-6">Login to continue</a>
        `
    }

    return `
        <div>
            <form id="payment-form" class="mt-12">
            <div class="relative w-1/2 ml-auto mb-4">
                <select id="paymentType" name="paymentType" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
                <option value="cod">Cash on delivery</option>
                <option value="card">Pay with card</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
                </div>
                <input class="border border=gray-400 p-2 w-1/2 mb-4" type="text" name="phone" placeholder="Phone Number" />
                <input class="border border=gray-400 p-2 w-1/2 mb-4" type="text" name="address" placeholder="Address" />
                <div>
                    <div id="card-element"></div>
                    <button class="btn-primary px-6 py-2 rounded-full text-white font-bold mt-6" type="submit">Order Now</button>
                </div>
            </form>
        </div>
    `
}

const renderItems = (items) => {
    return Object.values(items).map(pizza => {
        const obj = {
            _id: pizza.item._id,
            price: pizza.item.price,
        }

        return `
            <div class="pizza-list">
                <div class="flex items-center my-8">
                    <img class="w-24" src="/img/${pizza.item.image}" alt="pizza">
                    <div class="flex-1 ml-4">
                        <h1>${pizza.item.name}</h1>
                        <span>${pizza.item.size}</span>
                    </div>
                    <span class="flex-1">${pizza.qty} Pcs</span>
                    <span class="font-bold text-lg flex-1">₹${pizza.item.price * pizza.qty}</span>
                    <div class="flex items-center gap-2">
                        <span data-pizza=${JSON.stringify(obj)} class="removeItem bg-transparent cursor-pointer text-3xl px-2 py-1 font-bold text-red-500 border-0">-</span>
                        <span data-pizza=${JSON.stringify(obj)} class="addItem bg-transparent cursor-pointer text-3xl px-2 py-1 font-bold text-green-500">+</span>
                    </div>
                </div>
            </div>
        `
    }).join('');
}

const generateMarkup = ({session, user = null}) => {
    if(!session.cart) {
        return `
            <div class="empty-cart">
                <div class="container mx-auto text-center">
                    <h1 class="text-3xl font-bold mb-2">Cart Empty 🙁</h1>
                    <p class="text-gray-500 text-lg mb-12">You probably haven't ordered a pizza yet. <br> To order a pizza, go to the main page.</p>
                    <img class="w-2/5 mx-auto" src="/img/empty-cart.png" alt="empty-cart">
                    <a href="/" class="inline-block px-6 py-2 rounded-full btn-primary text-white font-bold mt-12">Go back</a>
                </div>
            </div>
        `
    }

    return `
        <div class="order container mx-auto xl:w-1/2">
            <div class="flex items-center border-b border-gray-300 pb-4">
                <img src="/img/cart-black.png" alt="cart-black">
                <h1 class="font-bold ml-4 text-2xl">Order Summary</h1>
            </div>
            ${renderItems(session.cart.items)}
            <hr>
            <div class="text-right pt-4">
                <div>
                    <span class="text-lg font-bold">Total Amount:</span>
                    <span class="amount text-2xl font-bold ml-2">₹${session.cart.totalPrice}</span>
                </div>
            </div>
            <div class="text-right pb-4">
                ${authenticatedUser(user)}
            </div>
        </div>
    `
}

const addCartItem = async (pizza) => {
    try {
        const response = await axios.post('/update-cart', pizza);

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

const deleteCartItem = async (pizza) => {
    try {
        const response = await axios.post('/delete-item', pizza);

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

const initCart = async (socket) => {
    const cartBody = document.getElementById('cartBody');
    let markup;
    try {
        const result = await axios.get('/cart', {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        });

        markup = generateMarkup(result.data);

        cartBody.innerHTML = markup;
    } catch(err) {
        console.log(err)
    }

    eventListeners();

    socket.on('cartUpdated', (data) => {
        cartBody.innerHTML = '';
        cartBody.innerHTML = generateMarkup(data);
        eventListeners();
        // Notification
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Cart Updated!',
            progressBar: false,
        }).show();
    });
}

export default initCart;