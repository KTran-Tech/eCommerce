import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../../actions/auth/index';
import { Link } from 'react-router-dom';
import { listOrders } from '../../actions/admin/apiAdmin';
// to help organize date and time
import moment from 'moment';
import { getFilteredProducts } from '../../actions/core/apiCore';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <h1 className='font-weight-bold'>Total orders: {orders.length}</h1>
      );
    } else {
      return <h1 className='text-danger'>No orders</h1>;
    }
  };

  //==========================================================
  return (
    <Layout
      title='Order History'
      description={`Good day ${user.name}, you can manage all your orders here`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showOrdersLength()}

          {/*For every product inside the state array, loop through each of them and assign 
      an index('i') to each of those product's key */}
          {orders.map((product, i) => {
            return (
              <div
                className='mt-5'
                key={i}
                style={{ borderBottom: '5px solid indigo' }}
              >
                <h2 className='mb-5'>
                  <span style={{ backgroundColor: '#b8e994' }}>
                    Order ID: {product._id}
                  </span>
                </h2>

                <ul className='list-group mb-2'>
                  <li className='list-group-item'>{product.status}</li>
                  <li className='list-group-item'>
                    Transaction ID: {product.transaction_id}
                  </li>
                  <li className='list-group-item'>Amount: ${product.amount}</li>
                  <li className='list-group-item'>
                    Ordered by: {product.user.name}
                  </li>
                  <li className='list-group-item'>
                    Ordered on: {moment(product.createdAt).fromNow()}
                  </li>
                  <li className='list-group-item'>
                    Delivery address: {product.address}
                  </li>
                </ul>

                <h3 className='mt-4 mb-4 font-italic'>
                  Total product in the order: {product.products.length}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
