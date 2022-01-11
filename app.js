//Importing modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cors = require('cors');
const errorHandler = require('./build/error-handler')
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');

//Configuring the enviroments file and turning it to constant
require('dotenv/config');
const CS = process.env.CONNECTION_STRING;
const port = process.env.PORT || 5000;

//Importing all the routes
const shopRouter = require('./routers/shop');
const adminRouter = require('./routers/admin');
const searchRouter = require('./routers/search');

app.set('view engine','ejs');
app.set('views','views'); 

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

//Using all the routes
app.use(`/`, shopRouter);
app.use(`/`, searchRouter);
app.use(`/admin`, adminRouter);

//Listening to port
app.listen(port, () => {
    console.log(`The server is running on port ${port}`)
    
    //Check if the database is working fine
    mongoose.connect(CS)
    .then(() => {
        console.log('Database connection is running')
    })
    .catch((err) => {
        console.log(err);
    })
});