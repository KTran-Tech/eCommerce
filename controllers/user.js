const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
  console.log('req.body', req.body);
  //create new user through the database
  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    //empty the property so they are returned empty
    user.salt = undefined;
    user.hashed_password = undefined;

    res.json({
      user,
    });
  });
};
