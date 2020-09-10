const express = require('express');
const router = express.Router();
//DESTRUCTURING METHODS AND FUNCTIONS
//==========================================
const { create } = require('../controllers/category');
//==========================================

router.get('/create', create);

module.exports = router;
