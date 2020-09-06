exports.userSignupValidator = (req, res, next) => {
  req.check('name', 'Name is required').notEmpty();
  req
    .check('email', 'Email must be between 3 to 32 characters')
    //must have an @ symbol
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
      min: 4,
      max: 32,
    });

  req.check('password', 'Password is required').notEmpty();
  req
    .check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    //must have at least one digit
    .matches(/\d/)
    .withMessage('Password must contain a number');

  //if there were errors then grab all errors with this method
  const errors = req.validationErrors();
  if (errors) {
    //map through the errors and get the first error
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }
  //for middleware you need to execute next() to move on to next phase everytime
  next();
};
