var express 	 = require('express');
var app			 = express();
var port 		 = process.env.PORT || 8080;

var cookieParser = require('cookie-parser');
var session 	 = require('express-session');
var summon 		 = require('express-summon-route');
var morgan 		 = require('morgan');
var bodyParser 	 = require('body-parser');
var passport 	 = require('passport');
var flash 		 = require('connect-flash');
var router 		 = express.Router();

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'ejs');

// Routes
require('./app/routes/campaignRoutes.js')(app, passport);
require('./app/routes/userRoutes.js')(app, passport);

app.listen(port);
console.log('Magic happens on port: ' + port);