const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

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
