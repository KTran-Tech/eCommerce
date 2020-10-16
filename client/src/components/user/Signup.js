import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import {signup} from '../../actions/auth/index'

const Signup = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false,
  });

  //=================================================
  const { name, email, password, success, error } = values;

  const handleChange = (e) => {
    //hide errors if there are any
    setValues({ ...values, error: false, [e.target.name]: e.target.value });
  };


  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    //pass in the values as an object
    signup({ name, email, password }).then((data) => {
      //makes sure 'error' specifically is returned and not 'err' or anything else from the backend
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          success: true,
        });
      }
    });
  };

  //
  const signUpForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          onChange={(e) => handleChange(e)}
          type='text'
          className='form-control'
          name='name'
          value={name}
        />
      </div>

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

  const showSuccess = () => (
    <div
      className='alert alert-info'
      style={{ display: success ? '' : 'none' }}
    >
      New account has been created. Please <Link to='/signin'>Signin</Link>
    </div>
  );

  return (
    <Layout
      title='Signup'
      description='Signup to Node React E-commerce App'
      className='container col-md-8 offset-md-2'
    >
      {showSuccess()}
      {showError()}
      {/* this is considered to be the 'children' props */}
      {signUpForm()}
    </Layout>
  );
  //
};

export default Signup;
