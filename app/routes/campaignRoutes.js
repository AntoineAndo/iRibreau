var path = require('path');
var appDir = path.dirname(require.main.filename);

// Modules
var routing = require(appDir + '/app/routes/routes');
var Campaign = require(appDir + '/app/dal/models/campaign');
var CampaignDao = require(appDir + '/app/dal/campaignDao');
var campaignDao = new CampaignDao();

module.exports = function(app, passport){

	app.get('/campaign', function(req, res, next) {

		campaignDao.getCampaigns(function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la récupération des campagnes']
	 			});
	 			
	 		}
	 		res.statusCode = 201;
	 		res.json(result);
	 	});
	});

	app.get('/mySubscriptions', function(req, res, next) {

	 	campaignDao.getCampaignsByUserSubscription(req.user.u_id, function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la récupération des campagnes']
	 			});
	 			
	 		}
	 		res.statusCode = 201;
	 		res.json(result);
	 	});
	});

	app.get('/myCampaigns', function(req, res, next) {

	 	campaignDao.getCampaignsByOwner(req.user.u_id, function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la récupération des campagnes']
	 			});
	 			
	 		}
	 		res.statusCode = 201;
	 		res.json(result);
	 	});
	});

	app.post('/campaign/new', function(req, res, next){

		console.log("POST NEW");
		console.log("requête : " + JSON.stringify(req.body));
		newCampaign = new Campaign();
	    newCampaign.title = req.body.title;
	    newCampaign.description = req.body.description;
	    newCampaign.minFollower = req.body.minFollower;
	    newCampaign.participantCount = 0;
	    newCampaign.budget = req.body.budget;
	    newCampaign.owner_id = parseInt(req.body.owner_id);
	    newCampaign.status = 'OPEND';
			
		campaignDao.saveNewCampaign(newCampaign, function(err, result){
	 		if(err){
	 			console.log("Erreur : " + err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la création d\' une campagne']
	 			});	
	 		}
	 		//res.statusCode = 201;
	 		//res.redirect('/test/myCampaigns');
	 	});
	});

/*
	app.get('/campaign/:id', function(req, res, next) {
		console.log("GET ID");
	 	campaignDao.findCampaignById(req.params.id, function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la récupération d\' une campagne']
	 			});
	 		}
	 		console.log(JSON.stringify(result));
	 		res.json(result);

	 		// Keeping only one result for security purpose
	 		if(result != null){
	 			if(result.row <= 1){
	 				res.json(result.rows[0]);
	 			}
	 		}
	 		res.statusCode = 201;
	 	});
	}); 
*/

	app.patch('/campaign/:id', function(req, res, next) {
		res.json("{}");
	});

	app.delete('/campaign/delete/:id',  function(req, res, next) {

		campaignDao.deleteCampaign(req.params.id, function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la suppression d\' une campagne']
	 			});
	 		}
	 		res.json(result);
	 		res.statusCode = 201;
	 	});
	});

	/**
	* Unit tests
	*/

	// routes vers les vues de test

	app.get('/test/campaign/new', function(req, res, next) {
		console.log(req.isAuthenticated());
		console.log(req.user);
	 	res.render('campaigns/newCampaign.ejs', {user: req.user});

	});

	app.get('/test/mySubscriptions', function(req, res, next) {

	 	campaignDao.getCampaignsByUserSubscription(req.user.u_id, function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la récupération des campagnes']
	 			});
	 			
	 		}
	 		res.render('campaigns/mySubscriptions.ejs', { campaigns: result });
	 	});
	});

	app.get('/test/myCampaigns', function(req, res, next) {

	 	campaignDao.getCampaignsByOwner(req.user.u_id, function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la récupération des campagnes']
	 			});
	 			
	 		}
	 		res.render('campaigns/myCampaigns.ejs', { campaigns: result });
	 	});
	});

	app.get('/test/profile', function(req, res, next) {

	 	campaignDao.getCampaignsByOwner(req.user.u_id, function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la récupération des campagnes']
	 			});
	 			
	 		}
	 		res.render('profile.ejs', { campaigns: result });
	 	});
	});
}