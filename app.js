const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require('cors');
var request = require('request');
const faceapi = require('face-api.js');
let mimeTypes = require('mime-types');
let bodyParser = require('body-parser');
const { stringify } = require('querystring');

//InitializationsNPM

const app = express();

var foto = ''

app.use(cors({
    origin: '*',
}));
let http = require('http').Server(app);



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
app.use(express.json({ limit: '80mb' }, { extended: true }));
app.use(express.urlencoded({ limit: '80mb' }, { extended: true }));
app.post((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use("/static", express.static('./static/'));


//Global Variables
app.use((req, res, next) => {

    next();
});
//Routes


app.use(require('./routes'));

// method to recept photos
app.post('/sendphotos', (req, res) => {
    console.log('recibimos algo');
    res.send('datos recibidos');
    //console.log(req.body);
    foto = req.body;
    app.get('/', (req, res) => {

        res.sendFile(path.join(__dirname, '/index.html'));


    });
    app.get('/mostrarfoto', (req, res) => {
        res.send(foto);
        //res.redirect('/pagina');
    });
});

//Public

app.use(express.static(path.join(__dirname, 'public')));

//Starting Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});