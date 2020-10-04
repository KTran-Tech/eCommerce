import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../../actions/auth/index';
import { Link } from 'react-router-dom';
import { createProduct, getCategories } from '../../actions/admin/apiAdmin';

const AddProduct = () => {
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

  const { user, token } = isAuthenticated();

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

  // load categories and set form data
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        //collect the array of categories coming from the API Database upon page load
        setValues({ ...values, categories: data, formData: new FormData() });
      }
    });
  };
  //runs for the first time and whenever there is a change in the state
  //here we are making use of the available FormData in the browser, make it available as soon as the component mounts
  //everytimes the page loads useEffects runs once because of the '[]'
  useEffect(() => {
    init();
  }, []);

  const handleChange = (e) => {
    //if the name is not 'photo' then set 'value' to the event's value else assign to its first array file
    const value =
      e.target.name === 'photo' ? e.target.files[0] : e.target.value;
    //the form data is what we use to send back to the backend
    formData.set(e.target.name, value);
    setValues({ ...values, [e.target.name]: value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });

    createProduct(user._id, token, formData).then((data) => {
      if (data.error) {
        //if ther is an error in the 'data' it will be displayed to the user in the UI
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: '',
          description: '',
          photo: '',
          price: '',
          category: '',
          shipping: '',
          quantity: '',
          loading: false,
          createdProduct: data.name,
          formData: new FormData(),
        });
      }
    });
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
        <label className='text-muted'>Product name</label>
        <input
          onChange={(e) => handleChange(e)}
          type='text'
          className='form-control'
          name='name'
          value={name}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Description</label>
        <textarea
          onChange={(e) => handleChange(e)}
          className='form-control'
          name='description'
          value={description}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Price</label>
        <input
          onChange={(e) => handleChange(e)}
          type='text'
          className='form-control'
          name='price'
          value={price}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Category</label>
        <select
          name='category'
          onChange={(e) => handleChange(e)}
          className='form-control'
          value={category}
        >
          <option>Please select</option>
          {/* if 'categories' is filled with non empty array THEN do... */}
          {/*map through the categories array(which is filled with objects) 
          and display each objects name, the 'i' is just a spare, an index for you to fill 
          the required 'key'*/}
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className='form-group'>
        <label className='text-muted'>Shipping</label>
        <select
          name='shipping'
          onChange={(e) => handleChange(e)}
          className='form-control'
          value={shipping}
        >
          <option>Please select</option>
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
          name='quantity'
          value={quantity}
        />
      </div>

      <button className='btn btn-outline-primary'>Create Product</button>
      {/*        */}
    </form>
  );

  const showError = () => (
    <section
      className='alert alert-danger'
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </section>
  );

  const showSuccess = () => (
    <section
      className='alert alert-info'
      style={{ display: createdProduct ? '' : 'none' }}
    >
      <h2>{`${createdProduct}`} has been created!</h2>
    </section>
  );

  const showLoading = () =>
    loading && (
      <section className='alert alert-success'>
        <h2>Loading...</h2>
      </section>
    );

    const goBack = () => (
      <div className='mt-5 mb-5'>
        <Link to='/admin/dashboard' className='text-warning'>
          Back to Dashboard
        </Link>
      </div>
    );

  return (
    <Layout
      title='Add a new product'
      description={`Good day ${user.name}, ready to add a new product?`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostform()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
