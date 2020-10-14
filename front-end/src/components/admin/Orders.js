import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../../actions/auth/index';
import { Link } from 'react-router-dom';
import { listOrders, getStatusValues } from '../../actions/admin/apiAdmin';
// to help organize date and time
import moment from 'moment';
import { getFilteredorders } from '../../actions/core/apiCore';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  //enum values sent back so that you can adjust the shipping status
  const [statusValues, setStatusValues] = useState([]);

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

  const loadStatusValues = () => {
    //enum values sent back so that you can adjust the shipping status
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
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

  const showInput = (name, value) => (
    <div className='input-group mb-2 mr-sm-2'>
      <div className='input-group-prepend'>
        <div className='input-group-text'>{name}</div>
        <input type='text' value={value} className='form-control' readOnly />
      </div>
    </div>
  );

  //to be able to update the shipping status to the backend 
  const handleStatusChange = (e, orderId) => {};

  //show shipping status
  const showStatus = (order) => (
    <div className='form-group'>
      <h3 className='mark mb-4'>Status: {order.status}</h3>
      <select
        className='form-control'
        //to be able to update the shipping status to the backend
        onChange={(e) => handleStatusChange(e, order._id)}
      >
        {/* option to update the shipping status */}
        <option>Update Status</option>
        {/*Loop through the state array 'statusValues' and for every status available
        from that array create an option for it*/}
        {statusValues.map((status, i) => (
          <option key={i} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  //==========================================================
  return (
    <Layout
      title='Order History'
      description={`Good day ${user.name}, you can manage all your orders here`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showOrdersLength()}

          {/*For every order inside the orders state array, loop through each of them and assign 
      an index('i') to each of those order's key */}
          {orders.map((order, i) => {
            return (
              <div
                className='mt-5'
                key={i}
                style={{ borderBottom: '5px solid indigo' }}
              >
                <h2 className='mb-5'>
                  <span style={{ backgroundColor: '#b8e994' }}>
                    Order ID: {order._id}
                  </span>
                </h2>

                <ul className='list-group mb-2'>
                  <li className='list-group-item'>{showStatus(order)}</li>
                  <li className='list-group-item'>
                    Transaction ID: {order.transaction_id}
                  </li>
                  <li className='list-group-item'>Amount: ${order.amount}</li>
                  <li className='list-group-item'>
                    Ordered by: {order.user.name}
                  </li>
                  <li className='list-group-item'>
                    Ordered on: {moment(order.createdAt).fromNow()}
                  </li>
                  <li className='list-group-item'>
                    Delivery address: {order.address}
                  </li>
                </ul>

                <h3 className='mt-4 mb-4 font-italic'>
                  Total products in the order: {order.products.length}
                </h3>

                {/* for every product in the 'order.products' loop through them and
                display their info */}
                {order.products.map((product, i) => (
                  <div
                    className='mb-4'
                    key={i}
                    style={{ padding: '20px', border: '1px solid indigo' }}
                  >
                    {showInput('Product name', product.name)}
                    {showInput('Product price', product.price)}
                    {showInput('Product total', product.count)}
                    {showInput('Product Id', product._id)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
