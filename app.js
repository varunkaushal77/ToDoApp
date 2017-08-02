var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mysql=require('mysql');
var router = express.Router();
var loginroutes=require('./routes/loginroutes')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var router = express.Router();

//test route
router.get('/', function(req, res) {
   res.send('Hello welcome to the TODO Application');
});


//route to handle user registration
router.post('/register',loginroutes.register);
router.post('/login',loginroutes.login)
app.use('/',router);

app.listen(3000);

console.log('App is running on 3000');  

