var mysql=require('mysql');
var connection=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'12345',
	database:'prismo'
});

connection.connect(function(err){
    if(err)
    	{
    		console.error(err);
            return ;
        }
        else 
        	console.log('Database is connected!');
});

// for registering user to the application
exports.register = function(req,res){
  var email=req.body.email;
  var today = new Date();
  var users={
    "first_name":req.body.first_name,
    "last_name":req.body.last_name,
    "email":req.body.email,
    "password":req.body.password,
    "created":today,
  }

  connection.query('SELECT * from users where email = ?',[email],function(error,results,fields)
  {
  	if(error){
    console.log("error occured",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
    }
    if(results[0].email == email)
    {
     res.send("User with the Email Already Exists.Please goto The login Page or use another Email to Register");
    }
    else
    {
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
    if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
    }
    else{
    console.log('The solution is: ', results);
    res.send({
      "code":200,
      "Success":"User Registered Sucessfully"
             });
    }
    });
    }

    
  })
  
}

//for loging in and authenticating users

exports.login = function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('The solution is: ', results);
    if(results.length > 0){
      if(results[0].password == password){
        res.send({
          "code":200,
          "success":"login sucessfull"
            });
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
        "success":"Email does not exits. Register Yourself!"
          });
    }
  }
  });
}