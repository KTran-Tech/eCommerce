const User = require('../models/user');

//the id coming from the route parameter
exports.userById = (req, res, next, id) => {
  //
  User.findById(id).exec((err, user) => {

    // if there are NO ERRORS
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    //req.profile is the profile of the id selected and passed in
    req.profile = user;

    next();
  });
};
