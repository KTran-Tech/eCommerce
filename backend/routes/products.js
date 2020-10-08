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
  listProductsByUserSearched,
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

//for listing all products + with queries like ?sortBy=createdAt
router.get('/search', list);
//used for the 'load more' products button 
//used for radio buttons/checkboxes 
router.post('/by/search', listBySearch);
//used for listing user search products
router.get('/listProductsByUserSearched', listProductsByUserSearched)

//
router.get('/related/:productId', listRelated);
router.get('/categories', listCategories);
router.get('/photo/:productId', photo);
//

router.get('/:productId', read);
router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);
//note: 'delete' is a reserved keyword in javascript so you can't use it
router.delete('/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
//put is used to update
router.put('/:productId/:userId', requireSignin, isAuth, isAdmin, update);

module.exports = router;
