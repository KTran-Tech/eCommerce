import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../../actions/auth/index';
import { Link } from 'react-router-dom';
import { createProduct } from '../../actions/admin/apiAdmin';

const AddProduct = () => {
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    shipping: '',
    quantity: '',
    photo: '',
    loading: false,
    error: '',
    createdProduct: '',
    redirectToProfile: false,
    formData: '',
  });

  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData,
  } = values;

  const newPostform = () => (
    <form className='mb-3'>
      {/*        */}
      <h4>Post Photo</h4>

      <div className='form-group'>
        <label className='btn btn-secondary'>
          <input
            onChange={handleChange('photo')}
            type='file'
            name='photo'
            accept='image/*'
          />
        </label>
      </div>

      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          onChange={handleChange('name')}
          type='text'
          className='form-control'
          value={name}
        />
      </div>
      {/*        */}
    </form>
  );

  return (
    <Layout
      title='Add a new product'
      description={`Good day ${user.name}, ready to add a new product?`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>{newPostform()}</div>
      </div>
    </Layout>
  );
};

export default AddProduct;
