var User = require('./models/user');
module.exports = function(app, passport){

	app.get('/', function(req, res){
		res.render('index.ejs');
	});

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', { user: req.user });
	});

	app.get('/auth/instagram',
		passport.authenticate('instagram'),
			function(req, res){});

	app.get('/auth/instagram/callback',
		passport.authenticate('instagram', { failureRedirect: '/' }),
		function(req, res) {
			user = req.user;
			req.logout();
			json = '{"user": {'+


					    '"u_id": "'+user.u_id+'",'+
					    '"token": "'+user.token+'",'+
					    '"username": "'+user.username+'",'+
					    '"profilePictureUrl": "'+user.profilePictureUrl+'",'+
					    '"followersCount": '+user.followersCount+','+
					    '"followingCount": '+user.followingCount+
					'}}';
	    	res.json(JSON.parse( json ));
      		//res.redirect('/profile');
		});
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}
