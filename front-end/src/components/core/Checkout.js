import React, { useState, useEffect } from 'react';
import {
  getBraintreeClientToken,
  processPayment,
} from '../../actions/core/apiCore';
import { isAuthenticated } from '../../actions/auth/index';
import { Link } from 'react-router-dom';
//allows for payment information layout
import DropIn from 'braintree-web-drop-in-react';
import { emptyCart } from '../../actions/core/cartHelpers';

//

//products array sent through as props
const Checkout = ({
  products,
  setRun = (f) => f, // default value of function
  run = undefined, // default value of undefined
}) => {
  const [data, setData] = useState({
    success: false,
    clientToken: null,
    error: '',
    instance: {},
    address: '',
  });

  //if user is authenticated THEN get user's id and token
  const userId = isAuthenticated && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((dataSentBack) => {
      if (dataSentBack.error) {
        setData({ ...data, error: dataSentBack.error });
      } else {
        setData({ ...data, clientToken: dataSentBack.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getTotal = () => {
    //'products' is an array of products
    return products.reduce((accumulator, nextValue) => {
      /*Starting out 'currentValue' is 0, nextValue is the first product item
      in the array passed in. And so we get its total 'count' * 'price'. Then we add + 
      it to the accumulator. After that, it loops through the next product item in line 
      of the product array prop */
      return accumulator + nextValue.count * nextValue.price;
    }, 0);
  };

  const buy = () => {
    // 'nonce' is the payment method (card type, card number)
    // nonce = data.instance.requestPaymentMethod()
    //nonce(token) is what we would use to send to the backend
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((dataSentBack) => {
        // console.log(data);
        // nonce = data.nonce;
        //once you have nonce (card type, card number), send nonce as 'paymentMethodNonce'
        //and also total to be charged
        // console.log(
        //   'send nonce and total to process',
        //   nonce,
        //   getTotal(products)
        // );
        nonce = dataSentBack.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products),
        };
        //
        processPayment(userId, token, paymentData)
          .then((response) => {
            //empty cart
            emptyCart(() => {
              //'!run' means set it to false because it is by default 'undefined
              setRun(!run);
              setData({ ...data, success: true });
            });
            //create order
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        // console.log('dropin error:', error);
        setData({ ...data, error: error.message });
      });
  };

  //allows for payment information layout(imported from third party source)
  const showDropIn = () => (
    /* 'onBlur' means if you click anywhere on this payment component then it will remove the
    error message displayed to the user if there were */
    <section
      //this works for chrome
      onBlur={() => setData({ ...data, error: '' })}
      //this is a poor alternative for firefox =(
      onClick={() => setData({ ...data, error: '' })}
    >
      {/* if token is not empty THEN if more than one products exist THEN do... */}
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          {/* allows for payment information layout */}
          <DropIn
            options={{
              authorization: data.clientToken,
              //option to pay with paypal as well
              paypal: {
                flow: 'vault',
              },
            }}
            //assigns the empty 'data.instance' with with 'instance'
            onInstance={(instance) => (data.instance = instance)}
          />
          <button
            //invoke 'buy' function only when button is clicked
            onClick={buy}
            className='btn btn-success btn-block'
          >
            Pay
          </button>
        </div>
      ) : null}
    </section>
  );

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to='/signin'>
        <button className='btn btn-primary'>Sign in to checkout</button>
      </Link>
    );
  };

  const showError = (error) => (
    <section
      className='alert alert-danger'
      //if error exist then display, else display none
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </section>
  );

  const showSucesss = (success) => (
    <section
      className='alert alert-info'
      //if error exist then display, else display none
      style={{ display: success ? '' : 'none' }}
    >
      Thanks! Your payment was successful!
    </section>
  );

 
  // ======================================================================
  return (
    <div>
      <h2>Total:${getTotal()}</h2>
      {showSucesss(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
