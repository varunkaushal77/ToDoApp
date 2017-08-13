// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '454529368252164', // your App ID
        'clientSecret'  : '00f9058811f415c582c238e7a07f173f', // your App Secret
        'callbackURL'   : 'http://localhost:3003/auth/facebook/callback'
    },

     'googleAuth' : {
        'clientID'      : '680924718577-87tm670la489trvlur68tq1r9bfjcv3u.apps.googleusercontent.com',
        'clientSecret'  : 'gsJGgfM9PM2skCs94WbYY-TO',
        'callbackURL'   : 'http://localhost:3003/auth/google/callback'
    }
};