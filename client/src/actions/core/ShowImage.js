import React from 'react';
import { API } from '../../config';

const ShowImage = ({ item }) => (
  <div className='product-img'>
    <img
      src={`/api/products/photo/${item._id}`}
      alt={item.name}
      className='mb-3'
      style={{maxHeight:"250px", maxWidth: "100%"}}
    />
  </div>
);

export default ShowImage;