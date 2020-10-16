const express = require('express');
const router = express.Router();

const { requireSignin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { generateToken, processPayment } = require('../controllers/braintree');

//execute everytime
//anytime there is a parameter called 'userId' in the route execute the method userById, it can be ANY route
//this middleware will makes sure to set the req --> req.profile to the user data sent back from DB
router.param('userId', userById);

router.get('/getToken/:userId', requireSignin, isAuth, generateToken);
router.post('/payment/:userId', requireSignin, isAuth, processPayment);

module.exports = router;
