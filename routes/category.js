const express = require('express');
const router = express.Router();
//DESTRUCTURING METHODS AND FUNCTIONS
//==========================================
const { create, categoryById, read, update,remove, list } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
//==========================================

//execute everytime
//anytime there is a parameter called 'userId' in the route execute the method userById, it cna be ANY route
//this middleware will makes sure to set the req --> req.profile to the user data sent back from DB
router.param('userId', userById);
router.param('categoryId', categoryById);

router.get('/:categoryId', read);
router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);
//'put' means update
router.put('/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
//note: 'delete' is a reserved keyword in javascript so you can't use it
router.delete('/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);
//get all the categories
router.get('/categories', list);

module.exports = router;
