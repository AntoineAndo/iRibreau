
var pg           = require('pg');
var conString    = "postgres://mbfiyemg:KTweF8vtP5FUNGaL1mw_5WUUOePRdofn@fizzy-cherry.db.elephantsql.com:5432/mbfiyemg";
var bcrypt = require('bcryptjs');

function Campaign(){
    this.campaign_id = 0;
    this.title = "";
    this.description = "";
    this.minFollower = 0;
    this.participantCount = 0;
    this.budget = 0;

    // This function is used to save a new campaign
    this.save = function(callback) {
        var client = new pg.Client(conString);
        client.connect();

        	query = 'INSERT INTO campaign(campaign_id, title, description, minFollower, participantCount, budget) VALUES($1, $2, $3, $4, $5, $6)';
        	data = [
        			this.campaign_id,
        			this.title,
        			this.description, 
        			this.minFollower,
        			this.participantCount,
        			this.budget
        			];

            client.query(query, data, function (err, result) {
                if(err){
    				client.end();
                    console.log(err);
                    return console.error('query error', err);
                }
            });


            client.query('SELECT * FROM campaign WHERE campaign_id = $1', [this.campaign_id], function(err, result){

                if(err){
                    return callback(null);
                }
                //if no rows were returned from query, then new campaign
                if (result.rows.length == 1){
                    console.log(result.rows[0]);
                    console.log(result.rows[0]['campaign_id'] + ' found!');
                    var campaign = new Campaign();
                    campaign.campaign_id= result.rows[0]['campaign_id'];
                    campaign.title = result.rows[0]['title'];
                    campaign.description = result.rows[0]['description'];
				    campaign.minFollower = result.rows[0]['minFollower'];
				    campaign.participantCount = result.rows[0]['participantCount'];
				    campaign.budget = result.rows[0]['budget'];
                    client.end();
                    return callback(null, campaign);
                }
            });

    };


}


Campaign.findOne = function(id, callback){
	var conString    = "postgres://mbfiyemg:KTweF8vtP5FUNGaL1mw_5WUUOePRdofn@fizzy-cherry.db.elephantsql.com:5432/mbfiyemg";
    var client = new pg.Client(conString);
    client.connect();

    client.query("SELECT * from campaign where campaign_id=$1", [id], function(err, result){

        client.end();

        if(err){
            return callback(err, this);
        }

        if (result.rows.length > 0){
            this.u_id = result.rows[0]['campaign_id'];
            this.title = result.rows[0]['title'];
            this.description = result.rows[0]['description'];
		    this.minFollower = result.rows[0]['minFollower'];
		    this.participantCount = result.rows[0]['participantCount'];
		    this.budget = result.rows[0]['budget'];

            return callback(null, this);
        }
        return callback(null, null);

    });
//});
};

Campaign.findById = function(id, callback){
    var client = new pg.Client(conString);

    client.connect();
    client.query("SELECT * from campaign where campaign_id=$1", [id], function(err, result){

        client.end();

        if(err){
    		client.end();
            return callback(err, null);
        }
        if (result.rows.length > 0){
            console.log(result.rows[0]['u_id'] + ' found!');
            var campaign_id = new Campaign();
            campaign_id.campaign_id= result.rows[0]['campaign_id'];
            campaign_id.title = result.rows[0]['title'];
            campaign_id.description = result.rows[0]['description'];
		    campaign_id.minFollower = result.rows[0]['minFollower'];
		    campaign_id.participantCount = result.rows[0]['participantCount'];
		    campaign_id.budget = result.rows[0]['budget'];
    		client.end();
            return callback(null, user);
        }
    });
};
module.exports = Campaign;