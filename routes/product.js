const express = require('express');
const router = express.Router();
//DESTRUCTURING METHODS AND FUNCTIONS
//==========================================
const {
  create,
  productById,
  read,
  remove,
  update,
} = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
//==========================================

//execute everytime
//anytime there is a parameter called 'userId' in the route execute the method userById, it cna be ANY route
//this middleware will makes sure to set the req --> req.profile to the user data sent back from DB
router.param('userId', userById);
router.param('productId', productById);

router.get('/:productId', read);
router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
//put is used to update
router.put('/:productId/:userId', requireSignin, isAuth, isAdmin, update);

module.exports = router;
