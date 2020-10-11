import React, { useState, useEffect } from 'react';
import { getBraintreeClientToken } from '../../actions/core/apiCore';
import { isAuthenticated } from '../../actions/auth/index';
import { Link } from 'react-router-dom';
//allows for payment information layout
import DropIn from 'braintree-web-drop-in-react';

//products array sent through as props
const Checkout = ({ products }) => {
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
    getBraintreeClientToken(userId, token).then((data) => {
      if (data.error) {
        setData(...data, data.error);
      } else {
        setData({ ...data, className: data.clientToken });
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

  const showDropIn = () => (
    //if token is not empty THEN if more than one products exist THEN do...
    <section>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          {/* allows for payment information layout */}
          <DropIn
            options={{ authorization: data.clientToken }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <button className='btn btn-success'>Checkout</button>
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

  // ======================================================================
  return (
    <div>
      <h2>Total:${getTotal()}</h2>
      {showCheckout()}
    </div>
  );
};

export default Checkout;
