var InstagramStrategy = require('passport-instagram').Strategy;

var pg           = require('pg');
var conString    = "postgres://mbfiyemg:MdxinfvL18_m50eg3qOauazlF9I31aef@fizzy-cherry.db.elephantsql.com:5432/mbfiyemg";
var client       = new pg.Client(conString);

var User            = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport, pg) {


    passport.serializeUser(function(user, done) {
        done(null, user.u_id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

	passport.use(new InstagramStrategy({
	    clientID: configAuth.instagramAuth.clientID,
	    clientSecret: configAuth.instagramAuth.clientSecret,
	    callbackURL: configAuth.instagramAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
    	process.nextTick(function(){

            profile = JSON.parse(profile._raw).data;
            //console.log(profile);

    		User.findOne(profile.id, function(err, user){
    			if(err){
    				console.log("err");
    				return done(err);
    			}
    			if(user){
    				console.log("found");
    				return done(null, user);
    			}
    			else {
    				console.log("new");
    				var newUser = new User();
    				newUser.u_id = profile.id;
    				newUser.token = accessToken;
                    newUser.username = profile.username;
                    newUser.profilePictureUrl = profile.profile_picture;
                    newUser.followersCount = profile.counts.followed_by;
                    newUser.followingCount = profile.counts.follows;
    				
                    
                    newUser.save(function(err, callback){
    					if(err)
    						throw err;
    					return done(null, newUser);
    				});
                    
    			}
    		});
    	});
	  }
	));


};