import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from '../../actions/core/apiCore';
import Card from './Card';
import Search from './Search';

//products array sent through as props
const Checkout = ({ products }) => {
  const getTotal = () => {
    console.log(products)
    return products.reduce((accumulator, nextValue) => {
      /*Starting out 'currentValue' is 0, nextValue is the first product item
      in the array passed in. And so we get its total 'count' * 'price'. Then we add + 
      it to the accumulator. After that, it loops through the next product item in line 
      of the product array prop */
      return accumulator + nextValue.count * nextValue.price;
    }, 0);
  };

  return (
    <div>
      <h2>Total:${getTotal()}</h2>
    </div>
  );
};

export default Checkout;
