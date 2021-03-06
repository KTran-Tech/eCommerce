import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import {
  signin,
  authenticate,
  isAuthenticated,
} from '../../actions/auth/index';
import { emptyCart } from '../../actions/core/cartHelpers';

const Signin = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    redirectToReferrer: false,
  });

  //=================================================
  const { email, password, loading, error, redirectToReferrer } = values;
  const { user } = isAuthenticated();

  const handleChange = (e) => {
    //hide errors if there are any
    setValues({ ...values, error: false, [e.target.name]: e.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    //pass in the values as an object
    signin({ email, password }).then((data) => {
      //makes sure 'error' specifically is returned and not 'err' or anything else from the backend
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        //make use of the data sent back and store it in local storage
        authenticate(data, () => {
          emptyCart(() => {
            setValues({
              ...values,
              redirectToReferrer: true,
            });
          });
        });
      }
    });
  };

  //
  const signinForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          onChange={(e) => handleChange(e)}
          type='email'
          className='form-control'
          name='email'
          value={email}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input
          onChange={(e) => handleChange(e)}
          type='password'
          className='form-control'
          name='password'
          value={password}
        />
      </div>

      <button onClick={clickSubmit} className='btn btn-primary'>
        Submit
      </button>
    </form>
  );

  const showError = () => (
    <div
      className='alert alert-danger'
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  //if loading is true THEN do...
  const showLoading = () =>
    loading && (
      <div className='alert alert-info'>
        <h2>Loading...</h2>
      </div>
    );

  const redirectUser = () => {
    //if user clicked submit to sign in
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return <Redirect to='/admin/dashboard' />;
      } else {
        return <Redirect to='/user/dashboard' />;
      }
    }
    //if user is already authenticated but try to use admin route eventhough they are regular user, then be redirected to home page
    if (isAuthenticated()) {
      return <Redirect to='/' />;
    }
  };

  return (
    <Layout
      title='Signin'
      description='Signin to Node React E-commerce App'
      className='container col-md-8 offset-md-2'
    >
      {showLoading()}
      {redirectUser()}
      {showError()}
      {/* this is considered to be the 'children' props */}
      {signinForm()}
    </Layout>
  );
  //
};

export default Signin;
