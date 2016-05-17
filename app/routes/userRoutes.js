	var path = require('path');
var appDir = path.dirname(require.main.filename);

// Modules
var routing = require(appDir + '/app/routes/routes');
var User = require(appDir + '/app/dal/models/user');

module.exports = function(app, passport){

	app.get('/', function(req, res){
		if(!req.isAuthenticated()){
			res.json(null); 
		}
		else{
			res.json(JSON.parse('{"ok":100}')); 
		}
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
			function(req, res){
				console.log("AUTH");
			});

	app.get('/auth/instagram/callback',
		passport.authenticate('instagram', { failureRedirect: '/' }),
		function(req, res) {
			console.log("AUTH CALLBACK");
	    	res.redirect('/profile');
		});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
};