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

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  //search by ID and update by body and set it as a "new" update
  User.findOneAndUpdate(
    { _id: req.profile._id },
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
