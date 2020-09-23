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
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
} = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
//==========================================

//execute everytime
//anytime there is a parameter called 'userId' in the route execute the method userById, it cna be ANY route
//this middleware will makes sure to set the req --> req.profile to the user data sent back from DB
router.param('userId', userById);
router.param('productId', productById);

//

router.get('/', list);
router.get('/related/:productId', listRelated);
router.get('/categories', listCategories);
router.post('/by/search', listBySearch);
router.get('/photo/:productID', photo);
//

router.get('/:productId', read);
router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);
//note: 'delete' is a reserved keyword in javascript so you can't use it
router.delete('/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
//put is used to update
router.put('/:productId/:userId', requireSignin, isAuth, isAdmin, update);

module.exports = router;
