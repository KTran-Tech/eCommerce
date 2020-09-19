const User = require('../models/user');

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
