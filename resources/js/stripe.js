import { loadStripe } from '@stripe/stripe-js/pure';
import placeOrder from "./apiService";

const initStripe = async () => {
    const stripe = await loadStripe('pk_test_51MKQphSDacrTsO6zCNWtC2qznwckpX9WYmUBdzrf3pxgotHFiYVXk7dwnmYXzcdeAzreiutKpt6eRYy5lmXIBziK00EtYp1rNY');     // we initialize the stripe with out public api key

    let card = null;
    const mountWidget = () => {
        const elements = stripe.elements();     // here we create a stripe element
    
        let style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'anatialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7cd',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        }
    
        card = elements.create('card', { style, hidePostalCode: true });        // this will create an instance of the stripe element with the defined style and with no zip postal code
        card.mount('#card-element');        // here we mount our stripe element onto our document element
    }

    // Payment
    const paymentForm = document.querySelector('#payment-form');
    // console.log(paymentForm.lastElementChild.lastElementChild)
    paymentForm.lastElementChild.lastElementChild.addEventListener('click', async (e) => {
        e.preventDefault();
        let formData = new FormData(paymentForm);
        let formObj = {}

        for(let [key, value] of formData.entries()) {
            formObj[key] = value;
        }

        if(!card) {
            // AJAX
            placeOrder(formObj);
            return;
        }

        // Verify Card
        try {
            const result = await stripe.createToken(card);
            console.log(result);

            formObj.stripeToken = result.token.id;
            placeOrder(formObj);
        } catch (error) {
            console.log(error)
        }





    });

    // Payment Type
    const paymentType = document.querySelector('#paymentType');

    paymentType.addEventListener('change', (e) => {
        e.preventDefault();
        if(e.target.value === 'card') {
            // Display Widget
            mountWidget();
        } else {
            // Destro Widget
            card.destroy();
        }
    });
}

export default initStripe;