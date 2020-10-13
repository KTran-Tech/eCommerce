const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
//saving user credentials in cookie
const cookieParser = require('cookie-parser');
//allows our api to handle request coming from different origin
const cors = require('cors');
//
const dotenv = require('dotenv');
dotenv.config();
//

// app
const app = express();

// db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected'));

// middlewares
//don't worry about 'dev'
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/products', require('./routes/products'));
app.use('/api/braintree', require('./routes/braintree'));
app.use('/api/orders', require('./routes/orders'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
