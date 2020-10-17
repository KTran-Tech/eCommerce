const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken'); //generage signed token
const expressJwt = require('express-jwt'); // for authorization check

exports.signup = (req, res) => {
  console.log('req.body', req.body);
  //create new user through the database
  const user = new User(req.body);

  //save the newly created data
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        // error: errorHandler(err),
        error: 'Email is already taken',
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

  if (!email || !password) {
    return res.status(400).json({
      error: 'Please enter both email and password',
    });
  }

  User.findOne({ email }, (err, user) => {
    /*IMPORTANT NOTE: it is important to not put the destructuring of 'user' here first 
    because the program needs time to figure out if 'user' is empty or not in the first place.
    If you were to start destructuring it immediately, it would cause an error*/
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup',
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
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the token as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 });
    /*IMPORTANT NOTE: it is important to put the destructuring of 'user' here because the program
    needs time to figure out if 'user' is empty or not in the first place. If you were to start
    destructuring it immediately, it would cause an error*/
    const { _id, name, email, role } = user;

    //return response with user and token to frontend client
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout Success' });
};

//check to see if the curreny JWT stored in user's cookie has valid JWT_SECRET compared to the program's, using expressJwt()
//requires the user to be logged in
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // added later
  //assigning the 'req' an 'auth' property
  userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
  //see if true or false
  //if req.profile is true(exist) THEN if req.auth is true THEN see if req.profile._id is equal to req.auth._id
  //req.auth was given from the 'requireSignin' middleware
  //(req.profile._id == req.auth._id) is not === because its not strictly, req.profile._id is an ObjectId and req.auth._id is a string
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  // console.log(req.auth._id)
  //if user does not turn out to be 'true' then output error
  if (!user) {
    return res.status(403).json({
      error: 'Access denied',
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access denied',
    });
  }
  //
  next();
};
