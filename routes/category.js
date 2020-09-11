const express = require('express');
const router = express.Router();
//DESTRUCTURING METHODS AND FUNCTIONS
//==========================================
const { create } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

//==========================================

router.get('/create/:userId', requireSignin, isAuth, isAdmin, create);

module.exports = router;
