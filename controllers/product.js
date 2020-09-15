//this will be handling form data, to do so you must install formidable
const formidable = require('formidable');
//lodash provides some methods that you could use
const _ = require('lodash');
//get access to file system
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

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
    //creates a new product from the product model using the passed in data(fields of text) from user
    let product = new Product(fields);

    // 1kb = 1000
    // 1mb = 1000000

    //if the user passed in not only fields but also FILES
    //if the files.img/files.photo exist then set the newly created product model(of fields) to have its photo.data property set to the passed in photo/img
    //we are using files.photo for this project rather than files.img
    if (files.photo) {
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
