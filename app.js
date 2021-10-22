const express = require('express');
const morgan = require('morgan');

//Initializations
const app = express();

//Settings
app.set('port', process.env.PORT || 5500);

//Middlewares
app.use(morgan('dev'));

const http = require("http");

//Global Variables

//Routes

//Public

//Starting Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});