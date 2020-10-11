import React from 'react';
import { isAuthenticated } from '../../actions/auth/index';
import { Link } from 'react-router-dom';

//products array sent through as props
const Checkout = ({ products }) => {
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

  const showCheckout = () => {
    return isAuthenticated() ? (
      <button className='btn btn-success'>Checkout</button>
    ) : (
      <Link to='/signin'>
        <button className='btn btn-primary'>Sign in to checkout</button>
      </Link>
    );
  };

  return (
    <div>
      <h2>Total:${getTotal()}</h2>
      {showCheckout()}
    </div>
  );
};

export default Checkout;
