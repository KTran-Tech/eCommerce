const express = require('express');
const router = express.Router();
//DESTRUCTURING METHODS AND FUNCTIONS
//
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
//
const { userById,read,update } = require('../controllers/user');

//execute everytime
//anytime there is a parameter called 'userId' in the route execute the method userById, it cna be ANY route
//this middleware will makes sure to set the req --> req.profile to the user data sent back from DB
router.param('userId', userById);
//=================================================================

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

//=================================================================

//read user profile
router.get('/:userId', requireSignin, isAuth, read);
//update user profuke
router.put('/:userId', requireSignin, isAuth, update);

module.exports = router;
