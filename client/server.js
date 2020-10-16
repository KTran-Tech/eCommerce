const express = require('express');
//package called 'compression'
const compression = require('compression');
//gain access to a 'path'
const path = require('path');
//using express
const app = express();
 
//initializing 'compression'
app.use(compression());
//running our react app from 'build' directory which will be created
app.use(express.static(path.join(__dirname, 'build')));
 
//all incoming req will be served in 'index.html' within the 'build folder'
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
 
const PORT = process.env.PORT || 3000;
 
//running on port 3000
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});


 