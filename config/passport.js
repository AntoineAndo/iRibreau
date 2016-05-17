// Absolute path
var path = require('path');
var appDir = path.dirname(require.main.filename);

//Modules
var InstagramStrategy = require('passport-instagram').Strategy;
var configAuth   = require(appDir + '/config/apiAuthentication');
var User         = require(appDir + '/app/dal/models/user');
var UserDao      = require(appDir + '/app/dal/userDao');
var userDao      = new UserDao();

module.exports = function(passport, pg) {

    passport.serializeUser(function(user, done) {
        done(null, user.u_id);
    });

    passport.deserializeUser(function(id, done) {
        userDao.findById(id, function(err, user) {
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

    		userDao.findOne(profile.id, function(err, user){
    			if(err){
    				console.log("err");
    				return done(err);
    			}
    			if(user){
    				console.log("found");

                    var newUser = new User();
                    newUser.u_id = profile.id;
                    newUser.token = accessToken;
                    newUser.username = profile.username;
                    newUser.profilePictureUrl = profile.profile_picture;
                    newUser.followersCount = profile.counts.followed_by;
                    newUser.followingCount = profile.counts.follows;

                    userDao.updateByUser(newUser, function(errUpdate){
                        if(errUpdate){
                            console.log(errUpdate);
                            return done(err);
                        }
                        return done(null, newUser);
                    });
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
                    
                    userDao.save(newUser, function(err, callback){
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