const mongoose = require('mongoose');
const express = require('express');
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

// mongoose.connection.on('error', (err) => {
//   console.log(`DB connection error: ${err.message}`);
// });

// routes middleware
app.use('/api/user', require('./routes/user'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
