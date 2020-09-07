const express = require('express');
const router = express.Router();
//DESTRUCTURING METHODS AND FUNCTIONS
//
const { requireSignin } = require('../controllers/auth');
//
const { userById } = require('../controllers/user');

router.get('/secret/:userId', requireSignin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

//execute everytime
//anytime there is a parameter called 'userId' in the route execute the method userById
//this middleware will makes sure to set the req --> req.profile to the user data sent back from DB
router.param('userId', userById);

module.exports = router;
