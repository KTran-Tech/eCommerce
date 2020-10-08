import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from '../../actions/core/apiCore';
import Card from './Card';
import Search from './Search'

const Home = () => {
  //load products from API by sell to the UI for user to see
  const [productsBySell, setProductsBySell] = useState([]);
  //load products from API by arrival to the UI for user to see
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);

  //runs for the first time or whenever there is a change in the state
  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  //load products from API by sell to the UI for user to see
  const loadProductsBySell = () => {
    getProducts('sold').then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };

  //load products from API by arrival to the UI for user to see
  const loadProductsByArrival = () => {
    getProducts('createdAt').then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  return (
    <Layout
      title='Home Page'
      description='Node React E-commerce App'
      className='container-fluid'
    >
      <Search />
      <h2 className='mb-4'>New Arrivals</h2>
      <div className='row'>
        {/*For every product inside the state array, loop through each of them and assign 
      an index('i') to each of those product's key and pass that product object 
      into the component as a prop */}
        {productsByArrival.map((product, i) => (
          <Card key={i} product={product} />
        ))}
      </div>

      <h2 className='mb-4'>Best Sellers</h2>
      <div className='row'>
        {/*For every product inside the state array, loop through each of them and assign 
      an index('i') to each of those product's key and pass that product object 
      into the component as a prop */}
        {productsBySell.map((product, i) => (
          <Card key={i} product={product} />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
