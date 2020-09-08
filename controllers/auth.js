const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken'); //generage signed token
const expressJwt = require('express-jwt'); // for authorization check

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

exports.signin = (req, res) => {
  //find the user based on email
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    const { _id, name, email, role } = user;

    if (err || !user) {
      return res.status(400).json({
        err: 'User with that email does not exist. Please signup',
      });
    }

    // if user is found make sure that email and password match
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password don't match",
      });
    }
    // generate a signed token with user id and secret
    const token = jwt.sign({ _id }, process.env.JWT_SECRET);
    //persist the token as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 });
    //return response with user and token to frontend client
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout Success' });
};

//check to see if the curreny JWT stored in user's cookie has valid JWT_SECRET using expressJwt()
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // added later
  userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
  //see if true or false
  //if req.profile is true(exist) THEN if req.auth is true THEN see if req.profile._id is equal to req.auth._id
  let user = req.profile && req.auth && req.profile._id === req.auth._id;

  if (!user) {
    return res.status(403).json({
      error: 'Access denied',
    });
  }

  next();
};
