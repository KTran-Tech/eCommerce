const User = require('../models/User');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

//the id coming from the route parameter
exports.userById = (req, res, next, id) => {
  //find user by the id from the parameter
  //reaching into the database's model
  User.findById(id).exec((err, user) => {
    // if there are NO ERRORS
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    //req.profile is the profile of the id selected and passed in
    //set the current logged in user to the user of the id in the parameter
    req.profile = user;

    next();
  });
};

//read user profile but without the password
exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  //search by ID and update by body and set it as a "new" update
  User.findOneAndUpdate(
    { _id: req.profile._id },
    //req.body hypotheticaly could accept anything, BUT the front end already has the input variables preset to the desired user input
    { $set: req.body },
    { new: true },
    //sends back the full user account info or error messages
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'you are not authorized to perform this action',
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};

// Middleware
exports.addOrderToUserHistory = (req, res, next) => {
  //this is for adding on to the existing User schema property 'history'
  let history = [];

  //IMPORTANT TO READ
  /*As you can see here, we are using a 'forEach' rather than map() because
  we are only using it once and then discard the entire thing rather than create and use an entirely
  new array like map(), here  we're just trying to push the products items to the 'history' array'*/
  //the 'order' is the finalized data sent back from the front-end to here
  req.body.order.products.forEach((item) => {
    //hypothetically you could do history.push(item) but you want to modify it to make it easier to read nad be useful
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    //push to the User's current property, 'history', with the 'history' array we just created
    { $push: { history: history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: 'Could not update user purchase history',
        });
      }
      next();
    }
  );
};

exports.purchaseHistory = (req, res) => {
  //find the order from DB by it's propertie's 'user' id
  Order.find({ user: req.profile._id })
    //populate the property 'user' and its own property of '_id and name'
    .populate('user', '_id name')
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
