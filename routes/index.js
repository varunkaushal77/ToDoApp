var express = require('express');
var router = express.Router();

var conn=require('./dbconnection');

    
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My ToDo List', success : req.session.success , errors : req.session.errors });
  req.session.errors=null; //after showing errors to the user making it null
  req.session.success=true;
});


router.post('/login',function(req,res,next)
{
//Check form validation here 
req.check('username','Invalid Username').isEmail(); // method added by express-validator, name passed as param should match the input names of the form, used built in validators
req.check('password','Invalid Password').isLength({min:4});

var errors=req.validationErrors();
if(errors)
{
req.session.errors=errors;
req.session.success=false;
res.redirect('/');
}
else{
  
req.session.success=true;
var email= req.body.username;
var password = req.body.password;

 conn.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    
    if(results.length >0){
      if(results[0].password == password){

        res.render('login',{username:email, password:password});
      }
      else{
        res.send({
          "code":204,
          "success":"Email and password does not match"
            });
      }
    }
    else{
      res.send({
        "code":204,
        "success":"Email does not exits"
          });
    }
  }
  });

}

});

router.get('/register',function(req,res,next)
{
 res.render('/register',{option:'Hello Welcome to registration'});
});

/*router.get('/submit/:username/:password',function(req,res,next)
{
  res.render('login',{nameofuser: req.params.username,passofuser: req.params.password});
});

router.post('/test',function(req,res,next)
{
  var username= req.body.username;
  var password= req.body.password;
  res.redirect('/submit/'+username+'/'+password);
});
*/
module.exports = router;
