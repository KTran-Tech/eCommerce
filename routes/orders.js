const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const {
  userById,
  addOrderToUserHistory,
  purchaseHistory,
} = require('../controllers/user');
const {
  create,
  listOrders,
  getStatusValues,
  orderById,
  updateOrderStatus,
} = require('../controllers/orders');
const { decreaseQuantity } = require('../controllers/product');

//execute everytime
//anytime there is a parameter called 'userId' in the route execute the method userById, it can be ANY route
//this middleware will makes sure to set the req --> req.profile to the user data sent back from DB
router.param('userId', userById);
//For these you're basically passing in the 'orderId' as an 'id' param for the function to use
router.param('orderId', orderById);

//an order is placed
router.post(
  '/create/:userId',
  requireSignin,
  isAuth,
  addOrderToUserHistory,
  decreaseQuantity,
  create
);

//IMPORTANT: The placement of these two routes do matter so be careful as it will cause a bug
// As User, get User's own purchase history
router.get('/by/user/:userId', requireSignin, isAuth, purchaseHistory);
// As Admin, list all orders placed by users
router.get('/list/:userId', requireSignin, isAuth, isAdmin, listOrders);

//send to front end the shipping status enum option values
router.get(
  '/status-values/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  getStatusValues
);

//receive back enum values chosen from front-end to here and update the shipping status of 'order'
//For these you're basically passing in the ':orderId' as an 'id' param for the function to use in 'router.param('orderId', orderById);'
router.put(
  '/:orderId/status/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  updateOrderStatus
);

module.exports = router;
