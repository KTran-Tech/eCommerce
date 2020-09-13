const express = require('express');
const router = express.Router();
//DESTRUCTURING METHODS AND FUNCTIONS
//==========================================
const { create } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
//==========================================

//execute everytime
//anytime there is a parameter called 'userId' in the route execute the method userById, it cna be ANY route
//this middleware will makes sure to set the req --> req.profile to the user data sent back from DB
router.param('userId', userById);

router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);

module.exports = router;
