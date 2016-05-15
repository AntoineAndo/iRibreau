var path = require('path');
var appDir = path.dirname(require.main.filename);

// Modules
var User = require(appDir + '/app/dal/models/user');

module.exports = function(app, passport){

	app.get('/', function(req, res){
		res.render('workInProgress.ejs');
	});

	app.get('/profile', isLoggedIn, function(req, res){
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
	});

	app.put('/profile', function(req, res){
		result = [];
		result.push(["u_id","1722278825"]);
		for(var i in req.body)
    		result.push([i, req.body[i]]);
    	//console.log(result);
    	User.update(result);
	});

	app.get('/auth/instagram',
		passport.authenticate('instagram'),
			function(req, res){});

	app.get('/auth/instagram/callback',
		passport.authenticate('instagram', { failureRedirect: '/' }),
		function(req, res) {
	    	res.redirect('/profile');
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