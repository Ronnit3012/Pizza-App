import axios from "axios";
import Noty from 'noty';

const placeOrder = async (formObj) => {
    try {
        const response = await axios.post('/orders', formObj);

        if(response.data.success) {
            new Noty({
                type: 'success',
                timeout: 1000,
                text: response.data.success,
                progressBar: false,
            }).show();

            setTimeout(() => {
                window.location.href = '/customer/orders';
            }, 1000);
        } else if(response.data.error) {
            new Noty({
                type: 'error',
                timeout: 1000,
                text: response.data.error,
                progressBar: false,
            }).show();
        }
    } catch(err) {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong!',
            progressBar: false,
        }).show();
    }
}

export default placeOrder;