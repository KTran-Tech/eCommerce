const express = require('express');
const router = express.Router();
//DESTRUCTURING METHODS AND FUNCTIONS
//==========================================
const {
  signup,
  signin,
  signout,
  requireSignin,
} = require('../controllers/auth');
const { userSignupValidator } = require('../validator');
//==========================================

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

 

module.exports = router;
