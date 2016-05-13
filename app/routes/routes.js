var User = require('../models/user');
module.exports = function(app, passport){

	app.get('/', function(req, res){
		res.render('workInProgress.ejs');
	});

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('workInProgress2.ejs', { user: req.user });
	});

	app.get('/myCampain', isLoggedIn, function(req, res){
		res.render("workInProgress3.ejs", { user: req.user });
	});

	app.get('/campain', isLoggedIn, function(req, res){
		res.render("workInProgress4.ejs", { user: req.user });
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