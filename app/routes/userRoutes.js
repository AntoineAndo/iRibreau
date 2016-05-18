var path = require('path');
var appDir = path.dirname(require.main.filename);
var CampaignDao = require(appDir + '/app/dal/campaignDao');
var campaignDao = new CampaignDao();
var UserDao = require(appDir + '/app/dal/userDao');
var userDao = new UserDao();

// Modules
var routing = require(appDir + '/app/routes/routes');
var User = require(appDir + '/app/dal/models/user');

module.exports = function(app, passport){

	app.get('/', function(req, res){
		res.render('workInProgress.ejs');
	});

	app.get('/profile', routing.isLoggedIn, function(req, res){
		user = req.user; 
		json = '{"user": {'+ 
			'"u_id": "'+user.u_id+'",'+ 
			'"token": "'+user.token+'",'+ 
			'"username": "'+user.username+'",'+ 
			'"profilePictureUrl": "'+user.profilePictureUrl+'",'+ 
			'"followersCount": '+user.followersCount+','+ 
			'"followingCount": '+user.followingCount+ 
		'}}'; 
		res.json(JSON.parse( json )); 
		//res.render('profile.ejs', { json: JSON.parse(json), user: req.user });
	});

	app.post('/profile', function(req, res){
		hobbies = req.body.hobbies;
		userDao.associateHobbies(req.user.user_id, hobbies, function(err){
			res.redirect('/profile');
		});
	});

	app.get('/profile/edit', function(req, res){
		campaignDao.getHobbies(function(err, hobbies){
			if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la récupération des hobbies']
	 			});
			}

			res.render('update-peon', {hobbies: hobbies});
		});
	});

	app.get('/auth/instagram',passport.authenticate('instagram'), function(req, res){
		console.log("AUTH");
	});

	//app.post('/auth', passport.authenticate('local', { session: false }), serialize, generateToken, respond);


	app.get('/auth/instagram/callback',
		passport.authenticate('instagram', { failureRedirect: '/' }),
		function(req, res) {
			console.log("AUTH CALLBACK");
			console.log(req.user);
	    	res.redirect('/profile');
		});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
};