import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { read } from '../../actions/core/apiCore';
import Card from './Card';

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    // on load assign the params productId to variable
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, []);

  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
      } else {
        setProduct(data);
      }
    });
  };

  return (
    <Layout
      title={product && product.name}
      description={
        //if produdct exist, THEN, if product.description exist, THEN....
        product && product.description && product.description.substring(0, 100)
      }
      className='container-fluid'
    >
      <div className='row'>
        {
          //if produdct exist, THEN, if product.description exist, THEN....
          product && product.description && (
            <Card product={product} showViewProductButton={false} />
          )
        }
      </div>
    </Layout>
  );
};

export default Product;
