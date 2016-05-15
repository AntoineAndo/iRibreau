var path = require('path');
var appDir = path.dirname(require.main.filename);

// Modules
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

	app.get('/myCampaigns', function(req, res, next) {

	 	campaignDao.getCampaignsByUser(req.user.u_id, function(err, result){
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

	app.put('/campaign/new', function(req, res, next){

		newCampaign = req.campaign;
		
		campaignDao.saveNewEntry(newCampaign, function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la création d\' une campagne']
	 			});
	 			
	 		}
	 		res.statusCode = 201;
	 		res.json("ebin");
	 	});
	});

	app.get('/campaign/:id', function(req, res, next) {

	 	campaignDao.findById(req.params.id, function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la récupération d\' une campagne']
	 			});
	 		}
	 		console.log(JSON.stringify(result));
	 		res.json(result);

	 		// Keeping only one result for security issues
	 		if(result != null){
	 			if(result.row <= 1){
	 				res.json(result.rows[0]);
	 			}
	 		}
	 		res.statusCode = 201;
	 		
	 	});
	});

	app.patch('/campaign/:id', function(req, res, next) {
		res.json("{}");
	});

	app.delete('/campaign/:id', function(req, res, next) {

	});


	/**
	* Unit tests
	*/

	// summon.use(app, express);

	// app.get('/campaign/new/createDummy', function(req, res, next){
	// 	testNewCampaign();
	// 	res.statusCode = 201;
	// });


	// function testNewCampaign(){

	// 	newCampaign = new Campaign();
	// 	newCampaign.owner_id = 1;
	// 	newCampaign.title = "Test title";
	// 	newCampaign.description = "Test description";
	// 	newCampaign.logo = "";
	// 	newCampaign.minFollower = 100;
	// 	newCampaign.participantCount = 0;
	// 	newCampaign.budget = 1000;

	// 	summon.route('/campaign/new','POST').addBody({campaign:'campaign'}).execute(function(code, result, response) {
	// 	    console.log(result); // outputs qBit!
	// 	    console.log(code); // 200 
	// 	});
	// }
}