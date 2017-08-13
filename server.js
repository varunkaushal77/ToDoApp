// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path     = require('path');
var session  = require('express-session');
var bodyParser = require('body-parser');
var app      = express();
var port     = process.env.PORT || 3003;
var passport = require('passport');
var flash    = require('connect-flash');
var hbs      =require('express-handlebars');

// configuration ===============================================================
 // connect to our database  code changed here *********************************

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms
    app.use(bodyParser.urlencoded({ extended: false }));
	app.engine('hbs',hbs({extname:'hbs', defaultLayout:'layout', layoutsDir:__dirname + '/views/handbarLayouts/'}));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');
    app.use(express.static(path.join(__dirname, 'public')));
	// required for passport
	app.use(express.session({ secret: 'varunlovesjavascript' , resave: true , saveUninitialized: true })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
