import React from 'react';
import { Link } from 'react-router-dom';
import ShowImage from '../../actions/core/ShowImage';
//component accepting outside props from other components
const Card = ({ product }) => {
  return (
    <section className='col-4 mb-3'>
      <div className='card'>
        <div className='card-header'>{product.name}</div>

        <div className='card-body'>
          <ShowImage item={product} />

          {/* show only the first 100 characters of the description */}
          <p>{product.description.substring(0, 100)}</p>

          <p>${product.price}</p>

          <Link to='/'>
            <button className='btn btn-outline-primary mt-2 mb-2 mr-2'>
              View Product
            </button>
          </Link>

          <button className='btn btn-outline-warning mt-2 mb-2'>
            Add to card
          </button>
        </div>
      </div>
    </section>
  );
};

export default Card;
