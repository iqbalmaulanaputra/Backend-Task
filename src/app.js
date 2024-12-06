const express = require('express');
const bodyParser = require('body-parser');
const injectDb = require("./middlewares/injectDb");
const noteRoutes = require('./routes/noteRoutes'); 

const app = express();


app.use(bodyParser.json());
app.use(injectDb);  


app.use('/api', noteRoutes);


app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = app;
