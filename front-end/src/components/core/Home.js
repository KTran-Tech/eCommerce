import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from '../../actions/core/apiCore';

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
    getProducts('sold').then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  return (
    <Layout title='Home Page' description='Node React E-commerce App'>
      {JSON.stringify(productsBySell)}
    </Layout>
  );
};

export default Home;
