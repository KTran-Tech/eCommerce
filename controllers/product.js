//this will be handling form data, to do so you must install formidable
const formidable = require('formidable');
//lodash library provides some methods that you could use
const _ = require('lodash');
//get access to file system
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

//middleware
exports.productById = (req, res, next, id) => {
  //reaching into the database's model
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: 'Product not found',
      });
    }
    req.product = product;
    next();
  });
};

exports.read = (req, res) => {
  //its inefficient to load the photo straight from req.product.photo so we must empty it bc photo is a huge size
  req.product.photo = undefined;

  return res.json(req.product);
};

exports.create = (req, res) => {
  //to handle form data
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  //req and res(fields and files)
  //fields are all the text, data, info, and files are seperate(another field, if you will but for images/photos instead)
  form.parse(req, (err, fields, files) => {
    //handles errors first if there are any
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      });
    }

    //check for all fields
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    //creates a new product from the product model using the passed in data(fields of text) from user
    let product = new Product(fields);

    // 1kb = 1000
    // 1mb = 1000000

    //if the user passed in not only fields but also FILES
    //if the files.img/files.photo exist then set the newly created product model(of fields) to have its photo.data property set to the passed in photo/img
    //we are using files.photo for this project rather than files.img
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size',
        });
      }

      //product model property set to the 'files.photo' image 'path' is the path to the image/photo
      product.photo.data = fs.readFileSync(files.photo.path);
      //set the new product model from 'fields' property to the files current file.photo.type
      product.photo.contentType = files.photo.type;
    }

    //makes sure to save the newly created product model
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: 'Product deleted successfully',
    });
  });
};

//===================================================================================

//===================================================================================

//===================================================================================

exports.update = (req, res) => {
  //to handle form data
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  //req and res(fields and files)
  //fields are all the text, data, info, and files are seperate(another field, if you will but for images/photos instead)
  form.parse(req, (err, fields, files) => {
    //handles errors first if there are any
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      });
    }

    //check for all fields
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    let product = req.product;
    //extend is provided by the lodash library
    //put in current 'product' and then the new updated 'field'
    product = _.extend(product, fields);

    // 1kb = 1000
    // 1mb = 1000000

    //if the user passed in not only fields but also FILES
    //if the files.img/files.photo exist then set the newly created product model(of fields) to have its photo.data property set to the passed in photo/img
    //we are using files.photo for this project rather than files.img
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size',
        });
      }

      //product model property set to the 'files.photo' image 'path' is the path to the image/photo
      product.photo.data = fs.readFileSync(files.photo.path);
      //set the new product model from 'fields' property to the files current file.photo.type
      product.photo.contentType = files.photo.type;
    }

    //makes sure to save the newly created product model
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

/*

 - sell / arrival
 // query the products by amount sold/ordered in a descending format with limit of 4
 - by sell = /products?sortBy=sold&order=desc&limit=4
 // query the products by the time it was created and ordered in a descending format with a limit of 4
 - by arrival = /products?sortBy=createdAt&order=desc&limit=4

 //if no params are sent through the url fron the front-end, then all products are returned
 
 */

exports.list = (req,res)=>{
  //if a query for the 'order' exist(coming from user) then use that pre-set query, else set it to an ascending order
  let order = req.query.order ? req.query.order: 'asc'
  //if a query for 'soryBy' exist(coming from user) then use that pre-set query(like sortBy date, ect), else sort it by default(being '_id')
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
  //if a query for 'limit' exist(coming from user) then use that pre-set query limit, else set it to limit of 6
  let limit = req.query.limit ? req.query.limit : 6
}