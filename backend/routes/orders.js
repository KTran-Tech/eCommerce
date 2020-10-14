const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById, addOrderToUserHistory } = require('../controllers/user');
const { create, listOrders, getStatusValues } = require('../controllers/orders');
const { decreaseQuantity } = require('../controllers/product');

//execute everytime
//anytime there is a parameter called 'userId' in the route execute the method userById, it can be ANY route
//this middleware will makes sure to set the req --> req.profile to the user data sent back from DB
router.param('userId', userById);

//an order is placed
router.post(
  '/create/:userId',
  requireSignin,
  isAuth,
  addOrderToUserHistory,
  decreaseQuantity,
  create
);

// As Admin, list all orders placed by users
router.get('/list/:userId', requireSignin, isAuth, isAdmin, listOrders);

router.get(
  '/status-values/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  getStatusValues
);

module.exports = router;
