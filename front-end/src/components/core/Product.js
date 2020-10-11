import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { read, listRelated } from '../../actions/core/apiCore';
import Card from './Card';

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);

  useEffect(() => {
    // on load assign the params productId to variable
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
    //whenever there is a change in the 'props' useEffect reloads
    //in this case if user clicks on view product on another related item
  }, [props]);

  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
      } else {
        //get the data about the id sent through the params
        setProduct(data);
        //fetch related products
        listRelated(data._id)
          .then((data) => {
          if (data.error) {
            console.log(data.error)
          } else {
            setRelatedProduct(data);
          }
        });
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
        <div className='col-8'>
          {
            //if produdct exist, THEN, if product.description exist, THEN....
            product && product.description && (
              <Card product={product} showViewProductButton={false} />
            )
          }
        </div>
        <div className='col-4'>
          <h4>Related Products</h4>
          {/*For every product inside the state array, loop through each of them and assign 
      an index('i') to each of those product's key and pass that product object 
      into the component as a prop */}
          {relatedProduct.map((p, i) => (
            <div className='mb-3'>
              <Card key={i} product={p} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
