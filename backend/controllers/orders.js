//import these schema from models folder (also used to connect to DB)
const { Order, CartItem } = require('../models/Order');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Middleware
//This is for the /:orderId/ params M.I.D.D.L.E.W.A.R.E
exports.orderById = (req, res, next, id) => {
  //find the requested 'order' item by it's id in order to update its shipping status
  Order.findById(id)
    //populate the 'name' and 'price', of every products in the 'order' found
    .populate('products.product', 'name price')
    .exec((err, order) => {
      // if there is error or 'order' does not simply exist
      if (err || !order) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      //similar to the req.profile = user;
      //assign the now found 'order' to 'req.order
      req.order = order;
      next();
    });
};

//create new orders from user's 'orders' data sent from front-end
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

exports.listOrders = (req, res) => {
  Order.find()
    .populate('user', '_id name address')
    .sort('-created')
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(orders);
    });
};

exports.getStatusValues = (req, res) => {
  //send the enum values from the Order schema model to the front end
  res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = (req, res) => {
  //'Order' schema model updating
  Order.update(
    //look for the database list of orders with the exact id as 'req.body.orderId'
    { _id: req.body.orderId },
    {
      $set: {
        status: req.body.status,
      },
    },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(order);
    }
  );
};
