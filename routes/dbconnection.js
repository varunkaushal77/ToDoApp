var mysql=require('mysql');

var conn=mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'12345',
        database:'prismo'
    });

    conn.connect(function(error)
    {
        if(error)
        throw error;
        else
        console.log('Database is connected!');
    }
    );

  module.exports=conn;
