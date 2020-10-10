import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ShowImage from '../../actions/core/ShowImage';
//for make the current time data readable
import moment from 'moment';
import {
  addItem,
  updateItem,
  removeItem,
} from '../../actions/core/cartHelpers';

//component accepting outside props from other components
// default value for 'showViewProductButton' is 'true'
// default value for 'showAddToCartButton' is 'true'
const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
}) => {
  //
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const showViewButton = (showViewProductButton) => {
    return (
      //if 'showViewProductButton' is true THEN...
      showViewProductButton && (
        <Link to={`/products/${product._id}`} className='mr-2'>
          <button className='btn btn-outline-primary mt-2 mb-2 mr-2'>
            View Product
          </button>
        </Link>
      )
    );
  };

  const addToCart = () => {
    //once the 'product' has been passed in and executed, redirect the user
    addItem(product, () => {
      //once the 'product' has been passed in and executed, redirect the user
      setRedirect(true);
    });
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to='/cart' />;
    }
  };

  const showAddToCart = (showAddToCartButton) => {
    return (
      //if showAddToCartButton is true THEN...
      showAddToCartButton && (
        <button
          onClick={addToCart}
          className='btn btn-outline-warning mt-2 mb-2'
        >
          Add to cart
        </button>
      )
    );
  };

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <span className='badge badge-primary badge-pill'>In Stock</span>
    ) : (
      <span className='badge badge-primary badge-pill'>Out of Stock</span>
    );
  };

  const handleChange = (e) => {
    //if e.target.value is smaller than 1, then make it 1 by default, otherwise use its current value
    //just making sure we don't have negative values
    setCount(e.target.value < 1 ? 1 : e.target.value);

    if (e.target.value >= 1) {
      //'product._id' to help identify the current product and e.target.value for current total count of the product
      updateItem(product._id, e.target.value);
    }
  };

  const showCartUpdateOptions = (cartUpdate) => {
    // if cartUpdate is true then return the following
    return (
      cartUpdate && (
        <section>
          <div className='input-group mb-3'>
            <div className='input-group-prepend'>
              <span className='input-group-text'>Adjust Quantity</span>
              <input
                type='number'
                className='form-control'
                value={count}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
        </section>
      )
    );
  };

  const showRemoveButton = (showRemoveProductButton) => {
    return (
      //if showAddToCartButton is true THEN...
      showRemoveProductButton && (
        <button
          onClick={() => removeItem(product._id)}
          className='btn btn-outline-danger mt-2 mb-2'
        >
          Remove Product
        </button>
      )
    );
  };

  //===================================================================

  return (
    <div className='card'>
      <div className='card-header name'>{product.name}</div>

      <div className='card-body'>
        {shouldRedirect(redirect)}
        <ShowImage item={product} />

        {/* show only the first 100 characters of the description */}
        <p className='lead mt-2'>{product.description.substring(0, 100)}</p>
        <p className='black-10'>${product.price}</p>
        <p className='black-9'>
          Category: {product.category && product.category.name}
        </p>
        <p className='black-8'>
          Added on {moment(product.createdAt).fromNow()}
        </p>

        {showStock(product.quantity)}
        <br />
        {showViewButton(showViewProductButton)}

        {showAddToCart(showAddToCartButton)}
        {showRemoveButton(showRemoveProductButton)}
        {showCartUpdateOptions(cartUpdate)}
        {/* --- */}
      </div>
    </div>
  );
};

export default Card;
