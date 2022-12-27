import axios from "axios";
import moment from "moment";

const renderItems = (items) => {
    let parsedItems = Object.values(items);
    return parsedItems.map(menuItem => {
        return `
            <p>${ menuItem.item.name } - ${ menuItem.qty } pcs</p>
        `
    }).join('');        // the join method will join all the elements of the array and make it into a string
}

const generateMarkup = (orders) => {
    return orders.map(order => {
        return `
            <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${ order._id }</p>
                    <div>${ renderItems(order.items) }</div>
                </td>
                <td class="border px-4 py-2">${ order.customerId.name }</td>
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value=${ order._id } />
                            <select name="status" onChnage="this.form.submit()"
                            class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus: shadow-outline">
                                <option value="order_placed" ${ order.status === 'order_placed' ? 'selected' : '' }>Placed</option>
                                <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>Confirmed</option>
                                <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>Prepared</option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>Delivered</option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>Completed</option>
                            </select>
                        </form>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
            </tr>
        `
    }).join('');        // this will join all the elements of the array into a single string
}

const initAdmin = async () => {
    const orderTableBody = document.querySelector('#orderTableBody');
    let orders = [];     // this will store the data from the request
    let markup;     // this is what will go inside the 'tbody'
    
    try {
        const result = await axios.get('/admin/orders', {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        });

        orders = await result.data;
        markup = generateMarkup(orders, moment);

        orderTableBody.innerHTML = markup;
    } catch (error) {
        console.log(error);
    }    
}

export default initAdmin;       // using ESM Syntax