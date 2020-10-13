//import these schema from models folder
const { Order, CartItem } = require('../models/Order');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  // console.log('Create Order', req.body);

  /*Making the 'order' property object (sent from the frontend) have a 'user' property
  so that it can determine the associated account that made the order, this is necessary
  for it to be inputed into the 'new Order()' schema */
  req.body.order.user = req.profile;

  //filling out the model with the available data
  const order = new Order(req.body.order);

  //save it to the DB
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    res.json(data);
  });
};
