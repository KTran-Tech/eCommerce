import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../../actions/auth/index';
import { Link } from 'react-router-dom';
import { getPurchaseHistory } from '../../actions/user/apiUser';
import moment from 'moment';

const Dashboard = () => {
  // note: 'history' returns [[obj],[obj]]
  const [history, setHistory] = useState([]);

  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const token = isAuthenticated().token;

  const init = (userId, token) => {
    getPurchaseHistory(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setHistory(data);
      }
    });
  };

  useEffect(() => {
    init(_id, token);
  }, []);

  //==============================================================

  const userLinks = () => {
    return (
      <div className='card'>
        <h4 className='card-header'>User Links</h4>
        <ul className='list-group'>
          <li className='list-group-item'>
            <Link className='nav-link' to='/cart'>
              My Cart
            </Link>
          </li>
          <li className='list-group-item'>
            <Link className='nav-link' to={`/user/dashboard/profile/${_id}`}>
              Update Profile
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className='card mb-5'>
        <h3 className='card-header'>User Information</h3>
        <ul className='list-group'>
          <li className='list-group-item'>{name}</li>
          <li className='list-group-item'>{email}</li>
          <li className='list-group-item'>
            {role === 1 ? 'Admin' : 'Registered User'}
          </li>
        </ul>
      </div>
    );
  };

  // note: 'history' returns [[obj],[obj]]
  const purchaseHistory = (history) => {
    return (
      <div className='card mb-5'>
        <h3 className='card-header'>Purchase History</h3>
        <ul className='list-group'>
          <li className='list-group-item'>
            {/* note: 'history' returns [[obj],[obj]] */}
            {/* for every orders there are loop through them all (the amount of orders the users have placed) */}
            {history.map((orders) => {
              return (
                <section>
                  <hr />
                  {/* for every products in the current 'order', loop through all the products */}
                  {orders.products.map((product, i) => {
                    return (
                      <div key={i}>
                        <h6>Product name: {product.name}</h6>
                        <h6>Product price: ${product.price}</h6>
                        <h6>
                          Purchased date: {moment(product.createdAt).fromNow()}
                        </h6>
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </li>
        </ul>
      </div>
    );
  };

  //==============================================================

  return (
    <Layout
      title='Dashboard'
      description={`Good day ${name}!`}
      className='container'
    >
      <div className='row'>
        <div className='col-3'>{userLinks()}</div>
        <div className='col-9'>
          {userInfo()}
          {/* note: 'history' returns [[obj],[obj]] */}
          {purchaseHistory(history)}
          {console.log(history)}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
