// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
var configAuth=require('./auth');
connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: password  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if ((rows[0].password!=password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows);
            });
        })
    );

    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        enableProof     : true,
        profileFields   : ['id', 'emails', 'name']

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {
        connection.query("SELECT * FROM `users` WHERE facebookid = '"+[profile.id]+"'", function(err,rows) {
                if (err)
                return done(err);
                
                if(rows.length)
                return done(null,rows);
                
                else {
                    // if there is no user with that username
                    // create the user
                    // set all of the facebook information in our user
                    var newUserMysql = {
                        facebookid: profile.id,
                        facebookname: profile.name.givenName+' '+profile.name.familyName, // look at the passport user profile to see how names are returned
                        facebookemail: profile.emails[0].value,
                        facebooktoken: token                                      
                    };
                    

                     connection.query("INSERT INTO users (facebookid, facebooktoken, facebookname, facebookemail) values ("+newUserMysql.facebookid+","+newUserMysql.facebooktoken+","+newUserMysql.facebookname+","+newUserMysql.facebookemail+")",function(err, rows) {
                        if(err)
                        throw err;
                        else
                        return done(null, newUserMysql);
                    });

                }

            });
        });

    }));
    
       // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            connection.query("SELECT googlename FROM `users` WHERE `googleid` = '"+[profile.id]+"'", function(err,rows) {
                if (err)
                return done(err);
                
                if(rows.length)
                return done(null,rows[0]);
                
                else {
                    // if there is no user with that username
                    // create the user
                    // set all of the google information in our user
                    var newUserMysql = {
                        googleid : profile.id,
                        googlename : profile.name.givenName, // look at the passport user profile to see how names are returned
                        googleemail : profile.emails[0].value,
                        googletoken : token                                      
                    };

                    // save the user

                    connection.query("INSERT INTO users (googleid, googletoken, googlename, googleemail) values('"+newUserMysql.googleid+"',"+newUserMysql.googletoken+",'"+newUserMysql.googlename+"','"+ newUserMysql.googleemail+"')",function(err, rows) {
                        if(err)
                        throw err;
                        else
                        return done(null, newUserMysql);
                    });

                }
            });
        });

    }));
    
    
};
