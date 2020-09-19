const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

//middleware
exports.categoryById = (req, res, next, id) => {
  //reaching into the database's model
  Category.findById(id).exec((err, category) => {
    if (err | !category) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    req.category = category;
    next()
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
