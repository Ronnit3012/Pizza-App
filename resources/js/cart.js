import axios from "axios";
import Noty from 'noty';

const cartCounter = document.querySelector('#cartCounter');

const eventListeners = () => {
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
            <form action="/orders" method="POST" class="mt-12">
                <input class="border border=gray-400 p-2 w-1/2 mb-4" type="text" name="phone" placeholder="Phone Number" />
                <input class="border border=gray-400 p-2 w-1/2 mb-4" type="text" name="address" placeholder="Address" />
                <div>
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
            <div class="text-right py-4">
                <div>
                    <span class="text-lg font-bold">Total Amount:</span>
                    <span class="amount text-2xl font-bold ml-2">₹${session.cart.totalPrice}</span>
                </div>
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