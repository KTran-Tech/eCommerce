import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../../actions/auth/index';
import {Redirect } from 'react-router-dom';
import { read, update, updateUser } from '../../actions/user/apiUser';

//'match' comes directly from 'props.match' props being the default
//this is a way to get the params 'id' from the url
const Profile = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: false,
    success: false,
  });

  const { token } = isAuthenticated();
  const { name, email, password, error, success } = values;

  const init = (userId) => {
    read(userId, token).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: true,
        });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
  };

  useEffect(() => {
    //get the parameter ':userId' from the url
    init(match.params.userId);
  }, []);

  //===========================================================

  const handleChange = (e) => {
    setValues({ ...values, error: false, [e.target.name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    //update the API backend
    //'match.params.userId' gets the parameter ':userId' from the url
    update(match.params.userId, token, { name, email, password }).then(
      (data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          //update the local storage
          //'data' is the new updated data sent back from the backend
          updateUser(data, () => {
            //this is the 'next' paramater that is executed after the middleware 'updateUser' has finished with 'data'
            setValues({
              ...values,
              name: data.name,
              email: data.email,
              success: true,
            });
          });
        }
      }
    );
  };

  const redirectUser = (success) => {
    if (success) {
      return <Redirect to='/cart' />;
    }
  };

  const profileUpdate = (name, email, password) => (
    <form>
      <section className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          type='text'
          onChange={(e) => handleChange(e)}
          className='form-control'
          name='name'
          value={name}
        />
      </section>
      <section className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          type='text'
          onChange={(e) => handleChange(e)}
          className='form-control'
          name='email'
          value={email}
        />
      </section>
      <section className='form-group'>
        <label className='text-muted'>Password</label>
        <input
          type='text'
          onChange={(e) => handleChange(e)}
          className='form-control'
          name='password'
          value={password}
        />
      </section>

      <button onClick={clickSubmit} className='btn btn-primary'>
        Submit
      </button>
    </form>
  );

  //===========================================================
  return (
    <Layout
      title='Profile'
      description='Update your profile'
      className='container-fluid'
    >
      <h2 className='mb-4'>Profile Update</h2>
      {profileUpdate(name, email, password)}
      {redirectUser(success)}
    </Layout>
  );
};

export default Profile;
