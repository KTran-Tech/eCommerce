import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { getCart } from '../../actions/core/cartHelpers';
import Card from './Card';
import Checkout from './Checkout';

const Cart = () => {
  //
  const [items, setItem] = useState([]);
  //this is designed to refresh the page everytime we have a change in things that need to be consistently updated
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItem(getCart());
    //anytime there is ANY change to the products in the 'run'  state, RELOAD the entire component
  }, [run]);

  const showItems = (items) => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr />
        {/*Loop through the 'items' array, and assign the 'i'(index) uniquely for 
        each and everysingle one of the products and pass in the product as a prop for the component */}
        {items.map((product, i) => (
          <Card
            key={i}
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            setRun={setRun} //passing in the 'setRun' state as a paramter function
            run={run} //passing in the 'run' state as a paramter
          />
        ))}
      </div>
    );
  };

  const noItemsMessage = () => (
    <h2>
      Your cart is empty.
      <br />
      <Link to='/shop'> Continue shopping</Link>
    </h2>
  );

  return (
    <Layout
      title='Shopping Cart'
      description='Manage your cart items. Add remove checkout or continue shopping'
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-6'>
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>

        <div className='col-6'>
          <h2 className='mb-4'>Your cart summary</h2>
          <hr />
          <Checkout
            products={items}
            setRun={setRun} //passing in the 'setRun' state as a paramter function
            run={run} //passing in the 'run' state as a paramter
          />
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
