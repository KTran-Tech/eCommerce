import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ShowImage from '../../actions/core/ShowImage';
//for make the current time data readable
import moment from 'moment';
import { addItem } from '../../actions/core/cartHelpers';

//component accepting outside props from other components
// default value for 'showViewProductButton' is 'true'
// default value for 'showAddToCartButton' is 'true'
const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
}) => {
  //

  const [redirect, setRedirect] = useState(false);

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
        {/* --- */}
      </div>
    </div>
  );
};

export default Card;
