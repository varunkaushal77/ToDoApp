var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My ToDo List' });
});

router.get('/submit/:username/:password',function(req,res,next)
{
  res.render('login',{nameofuser: req.params.username,passofuser: req.params.password});
});

router.post('/test',function(req,res,next)
{
  var username= req.body.username;
  var password= req.body.password;
  res.redirect('/submit/'+username+'/'+password);
});

module.exports = router;
