const Category = require('../models/Category');
const { errorHandler } = require('../helpers/dbErrorHandler');

//middleware
exports.categoryById = (req, res, next, id) => {
  //reaching into the database's model
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: 'Category does not exist',
      });
    }
    req.category = category;
    next();
  });
};

exports.create = (req, res) => {
  //create a new object of category from the Category Model
  const category = new Category(req.body);

  //have to save the changes to the database
  category.save((err, data) => {
    //if there are any erros
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      data,
    });
  });
};

exports.read = (req, res) => {
  return res.json(req.category);
};

exports.update = (req, res) => {
  const category = req.category;

  category.name = req.body.name;

  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  const category = req.category;

  category.remove((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: 'Category deleted',
    });
  });
};

exports.list = (req, res) => {
  //find all and then execute
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
