import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../../actions/auth/index';
import { Link } from 'react-router-dom';
import { createProduct } from '../../actions/admin/apiAdmin';

const AddProduct = () => {

  const {user,token} = isAuthenticated();

  return (
    <Layout
      title='Add a new product'
      description={`Good day ${user.name}, ready to add a new product?`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          ...
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
