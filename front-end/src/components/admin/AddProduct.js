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

  //here we are making use of the available FormData in the browser, make it available as soon as the component mounts
  //everytimes the page loads useEffects runs once because of the '[]'
  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
  }, []);

  const handleChange = (e) => {
    //if the name is not 'photo' then set 'value' to the event's value else assign to its first array file
    const value =
      e.target.name === 'photo' ? e.target.files[0] : e.target.value;
    //the form data is what we use to send back to the backend
    formData.set(e.target.name, value);
    setValues({ ...values, [e.target.name]: value });
  };

  const clickSubmit = (e) => {
    //
  };

  const newPostform = () => (
    <form className='mb-3' onSubmit={clickSubmit}>
      {/*        */}
      <h4>Post photo</h4>

      <div className='form-group'>
        <label className='btn btn-secondary'>
          <input
            onChange={(e) => handleChange(e)}
            type='file'
            name='photo'
            accept='image/*'
          />
        </label>
      </div>

      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          onChange={(e) => handleChange(e)}
          type='text'
          className='form-control'
          value={name}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Description</label>
        <textarea
          onChange={(e) => handleChange(e)}
          className='form-control'
          value={description}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Price</label>
        <input
          onChange={(e) => handleChange(e)}
          type='text'
          className='form-control'
          value={price}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Category</label>
        <select onChange={(e) => handleChange(e)} className='form-control'>
          <option value='5f758518ebcea61bfd10cd02'>NodeJs</option>
        </select>
      </div>

      <div className='form-group'>
        <label className='text-muted'>Shipping</label>
        <select onChange={(e) => handleChange(e)} className='form-control'>
          <option value='0'>No</option>
          <option value='1'>Yes</option>
        </select>
      </div>

      <div className='form-group'>
        <label className='text-muted'>Quantity</label>
        <input
          onChange={(e) => handleChange(e)}
          type='number'
          className='form-control'
          value={quantity}
        />
      </div>

      <button className='btn btn-outline-primary'>Create Product</button>
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
