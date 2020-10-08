import React from 'react';
import { Link } from 'react-router-dom';
import ShowImage from '../../actions/core/ShowImage';

//component accepting outside props from other components
// default value for 'showViewProductButton' is 'true'
const Card = ({ product, showViewProductButton = true }) => {
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

  return (
    <div className='card'>
      <div className='card-header'>{product.name}</div>

      <div className='card-body'>
        <ShowImage item={product} />

        {/* show only the first 100 characters of the description */}
        <p>{product.description.substring(0, 100)}</p>

        <p>${product.price}</p>

        {showViewButton(showViewProductButton)}

        <button className='btn btn-outline-warning mt-2 mb-2'>
          Add to cart
        </button>
        {/* --- */}
      </div>
    </div>
  );
};

export default Card;
