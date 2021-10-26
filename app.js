const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const faceapi = require('face-api.js');
let mimeTypes = require('mime-types');
let bodyParser = require('body-parser');

//InitializationsNPM

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let http = require('http').Server(app);
app.use("/static", express.static('./static/'));

//Settings
app.set('port', process.env.PORT || 5500);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Global Variables
app.use((req, res, next) => {

    next();
});


//Routes

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '/index.html'));


});
app.use(require('./routes'));


// method to res photos

app.post('/sendphotos', (req, res) => {
    res.send('datos recibidos');

    console.log(req.body.username)


});


//Public

app.use(express.static(path.join(__dirname, 'public')));


//Starting Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});