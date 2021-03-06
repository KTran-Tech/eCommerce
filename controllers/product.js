//this will be handling form data, to do so you must install formidable
const formidable = require('formidable');
//lodash library provides some methods that you could use
const _ = require('lodash');
//get access to file system
const fs = require('fs');
const Product = require('../models/Product');
const { errorHandler } = require('../helpers/dbErrorHandler');

//middleware
exports.productById = (req, res, next, id) => {
  //reaching into the database's model
  Product.findById(id)
    .populate('category')
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: 'Product not found',
        });
      }
      req.product = product;
      next();
      //
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
      //doing this so that the img/png can be converted and not take up space
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
    // const { name, description, price, category, quantity, shipping } = fields;

    // if (
    //   !name ||
    //   !description ||
    //   !price ||
    //   !category ||
    //   !quantity ||
    //   !shipping
    // ) {
    //   return res.status(400).json({
    //     error: 'All fields are required',
    //   });
    // }

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
 // query the products by 1) amount sold/ordered 2)in a descending format 3)with limit of 4
 - by sell = /products?sortBy=sold&order=desc&limit=4
 // query the products by the 1)time it was created 2)and ordered in a descending format 3)with a limit of 4
 - by arrival = /products?sortBy=createdAt&order=desc&limit=4

 //if no params are sent through the url fron the front-end, then all products are returned
 
 */

exports.list = (req, res) => {
  //if a query for the 'order' exist(coming from user) then use that pre-set query, else set it to an ascending order
  let order = req.query.order ? req.query.order : 'asc';
  //if a query for 'soryBy' exist(coming from user) then use that pre-set query(like sortBy date, ect), else sort it by default(being '_id')
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  //if a query for 'limit' exist(coming from user) then use that pre-set query limit, else set it to limit of 6
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  //query through the entire search, exclude 'photo' from all product objects
  //and populate it(like '...spread' out data from another model)
  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      //
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        });
      }
      res.json(products);
    });
};

//listing all products BUT without queries
exports.listAll = (req, res) => {
  Product.find()
    .select('-photo')
    .populate('category')
    .exec((err, products) => {
      //
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        });
      }
      res.json(products);
    });
};

/*
 //Find the products based on the req.product.category
 //Products with the same category, will be returned
*/

exports.listRelated = (req, res) => {
  //if a query for 'limit' exist(coming from user) then use that pre-set query limit, else set it to limit of 6
  let limit = req.query.limit ? parseInt(req.query.limit) : 2;
  //find all the product based on '_id', but do not include the current global req.product
  //find all the products that has matching categories to the CURRENT global req.product.category
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    //get only 'name' and '_id' as well
    .populate('category', '_id name')
    .exec((err, products) => {
      //
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        });
      }
      res.json(products);
    });
};

exports.listCategories = (req, res) => {
  //find all the 'category' used in the Product model
  //'{}' is empty because its used for passing query
  Product.distinct('category', {}, (err, categories) => {
    //
    if (err) {
      return res.status(400).json({
        error: 'Categories not found',
      });
    }
    res.json(categories);
  });
};

/*
  - List products by search
  - Show categories in checkboxes + price range in radio buttons. All on the left of UI
  - As the user click on the checkboxes/radio-buttons on the left side of UI, there will 
    be a API request send to show the products to the users based on what he wants
*/

exports.listBySearch = (req, res) => {
  //if a req.body for the 'order' exist(coming from user) then use that pre-set body query, else set it to an descending order
  let order = req.body.order ? req.body.order : 'desc';
  //if a req.body for 'soryBy' exist(coming from user) then use that pre-set body query (like sortBy date, ect), else sort it by default(being '_id')
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  //if a req.body for 'limit' exist(coming from user) then use that pre-set body query limit, else set it to limit of 100
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  //for 'load more' products button in pages
  let skip = parseInt(req.body.skip);
  //argument object that will contain category id and price range
  let findArgs = {};

  //req.body.filters is a list of properties of filter query from the user, like user wants lowest to highest price
  //for every item in the req.body.filter object
  for (let key in req.body.filters) {
    //if the item(key) at req.body.filter[x] is not empty(length greater than 0) then continue
    if (req.body.filters[key].length > 0) {
      //if one of the filter properties from the user is 'price'
      if (key === 'price') {
        //key object should be a value of something like [10,19]
        // gte - greater than price [0-10]
        // lte - less than
        //'price' property set for findArgs object
        findArgs[key] = {
          $gte: req.body.filters[key][0], // [0]
          $lte: req.body.filters[key][1], // [10]
        };
      } else {
        //else set the curreny property(key) for the findArgs object
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  //query through the entire search, exclude 'photo' from all product objects
  //and populate it(like '...spread' out data from another model)
  Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err)
        return res.status(400).json({
          error: 'Products not found',
        });

      res.json({
        size: data.length,
        data,
      });
    });
};

//middleware
//a way to view any products photo
exports.photo = (req, res, next) => {
  //if the sent product's photo.data(photo) exist, then add changes to the response content-type
  if (req.product.photo.data) {
    /*Here you are converting the current content-type(file) to its original form (img/png) which
    allows you to physically see it */
    //photo.contentType can be 'png'/'image' or anything
    res.set('Content-Type', req.product.photo.contentType);
    /*send back the same data but remodified the content type from files to actual img/png 
    where you can see it in full picture and not full text*/
    return res.send(req.product.photo.data);
  }
  next();
  //
};

exports.listProductsByUserSearched = (req, res) => {
  // to hold 2 values: search & category
  const query = {};

  //to hold value 'search' as 'name' in query
  if (req.query.search) {
    query.name = {
      $regex: req.query.search,
      // 'i' stands for case insensitivity
      $options: 'i',
    };

    //to hold 'category' as 'category' in query
    if (req.query.category && req.query.category != 'All') {
      query.category = req.query.category;
    }

    // find the product based on query objects with 2 properties
    // search & category
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(products);
    })
      .select('-photo')
      .populate('category');
    //
  }
};

//Middleware
exports.decreaseQuantity = (req, res, next) => {
  //the 'order' is the finalized data sent back from the front-end to here
  //map() helps us create a new filtered array
  //loop through ALL the products in 'order' (the products that the user has ordered)
  let bulkOps = req.body.order.products.map((item) => {
    return {
      //'updateOne' is a special mongoose function
      //used to update the first document that matches the condition
      updateOne: {
        //look for the database list of products with the user purchased product's id
        filter: { _id: item._id },
        //update the product matched with the new data
        update: {
          /*If the user has ordered 3 items of a product, then we go back into
          the database and minus that '3' with the quantity NOW available. Also use
          that 3 for an increase in the product sold */
          $inc: {
            quantity: -item.count,
            sold: +item.count,
          },
        },
      },
    };
  });

  //'bulkWrite' is also a special mongoose function
  //'bulkWrite' here seems to act the save way as 'save'
  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: 'Could not update product',
      });
    }
    next();
  });
};
