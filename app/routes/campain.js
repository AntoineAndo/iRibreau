var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/campain', function(req, res, next) {
	res.statusCode = 201;
  res.send('respond with a resource');
});

router.post('/campain', function(req, res, next) {

 	var sql = 'INSER INTO campain () VALUES ($1, $2, $3, $4, $5)';

 	var data = [
 		req.body.title,
 		req.body.title,
 		req.body.title,
 		req.body.title
 	];
 	
 	postgres.client.query(sql, data, function(err, result){
 		if(err){
 			console.log(err);
 			res.statusCode = 500;
 			return res.json({
 				errors: ['Problème lors de la création d\' une campagne']
 			});
 		}
 		var photoId = result.rows[0].id;

 		var sql = 'SELECT * FROM campain WHERE id = $1';
	 		postgres.client.query(sql, [photoId], function(err, result){
	 		if(err){
	 			console.log(err);
	 			res.statusCode = 500;
	 			return res.json({
	 				errors: ['Problème lors de la récupération de l\'image ']
	 			});
	 		}

	 		res.statusCode = 201;
	 		res.json(result.rows[0]);
 		});


 	});
});

router.get('/campain/new', function(req, res, next){
	res.statusCode = 201;
})

router.get('/campain/:id', function(req, res, next) {

 	var sql = 'SELECT * FROM campain WHERE id = $1';

 	var data = [
 		req.id;
 	];
 	
 	postgres.client.query(sql, data, function(err, result){
 		if(err || result.length > 1){
 			console.log(err);
 			res.statusCode = 500;
 			return res.json({
 				errors: ['Problème lors de la création d\' une campagne']
 			});
 		}
 		res.statusCode = 201;
 		res.json(result.rows[0]);
 	});
});

router.patch('/campain/:id', function(req, res, next) {
	res.json("{}");
});

router.delete('/campain/:id', function(req, res, next) {

});

module.exports = router;
