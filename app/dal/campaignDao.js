/**
* Data access layer for campaigns
*
* @class campaignDao.js
*/

// Absolute path
var path = require('path');
var appDir = path.dirname(require.main.filename);

// Modules
var pg = require('pg');
var bcrypt = require('bcryptjs');
var Database = require(appDir + '/config/database');
var Campaign = require(appDir + '/app/dal/models/campaign');

function CampaignDao(){

    db = new Database();
    var conString = db.getConnectionString();

    // Creates a new campaign
    this.saveNewEntry = function(campaign, callback) {
        var client = new pg.Client(conString);
        client.connect();

    	query = QUERY_INSERT_NEW_CAMPAIGN;
    	data = [
                campaign.owner_id,
    			campaign.title,
    			campaign.description, 
                campaign.logo,
    			campaign.minFollower,
    			campaign.participantCount,
    			campaign.budget
    			];

        client.query(query, data, function (err, result) {
            if(err){
    			client.end();
                console.log(err);
                return console.error('query error', err);
            }
        });
    }

    // Updates the campaign
    this.update = function(){

    }

    // Finds one campaign by id
    this.findById = function(id, callback){
        var client = new pg.Client(conString);

        console.log("finding campaign by id :" + id + "...")

        client.connect();
        client.query(QUERY_FIND_CAMPAIGN_BY_ID, [id], function(err, result){

            client.end();
            if(err){
                return callback(err, null);
            }
            if (result.rows.length > 0){
                campaign = generateCampaignFromQuery(result, 0);
                return callback(null, campaign);
            }
            return callback(null, null);
        });
    }

    // Finds all of the campaigns
    this.getCampaigns = function(callback){
        var client = new pg.Client(conString);

        client.connect();
        client.query(QUERY_FIND_CAMPAIGNS, function(err, result){

            client.end();
            if(err){
                return callback(err, null);
            }

            var campaigns = [];
            if(result.rows.length > 0){
                for(i = 0; i < result.rows.length; i++){
                    var campaign = generateCampaignFromQuery(result, i);
                    campaigns.push(campaign);
                }
            }
            
            return callback(null, campaigns);
        });
    }


    // Finds all of the campaigns on which the user is subscribed to
    this.getCampaignsByUser = function(id, callback){
        var client = new pg.Client(conString);

        client.connect();
        client.query(QUERY_FIND_CAMPAIGNS_BY_USER, [id], function(err, result){

            client.end();
            if(err){
                return callback(err, null);
            }

            var campaigns = [];
            if(result.rows.length > 0){
                for(i = 0; i < result.rows.length; i++){
                    var campaign = generateCampaignFromQuery(result, i);
                    campaigns.push(campaign);
                }
            }
            
            return callback(null, campaigns);
        });
    }

    // Create a new json object from query result
    function generateCampaignFromQuery(result, rowIndex){
        var campaign = new Campaign();
        campaign.campaign_id= result.rows[rowIndex]['id_campaign'];
        campaign.owner_id = result.rows[rowIndex]['owner_id'];
        campaign.title = result.rows[rowIndex]['titre'];
        campaign.description = result.rows[rowIndex]['description'];
        campaign.logo = result.rows[rowIndex]['logo'];
        campaign.minFollower = result.rows[rowIndex]['minFollower'];
        campaign.participantCount = result.rows[rowIndex]['participantCount'];
        campaign.budget = result.rows[rowIndex]['budget'];
        campaign.status = result.rows[rowIndex]['status'];
        return campaign;
    }

    /**
    * QUERIES
    **/

    QUERY_INSERT_NEW_CAMPAIGN = 'INSERT INTO campaign(id_owner, title, description, logo, minFollower, participantCount, budget) VALUES($1, $2, $3, $4, $5, $6, $7)';

    QUERY_FIND_CAMPAIGNS = 'SELECT * from campaign';

    QUERY_FIND_CAMPAIGN_BY_ID = 'SELECT * from campaign where id_campaign=$1';

    QUERY_FIND_CAMPAIGNS_BY_USER = 'SELECT campaign.id_campaign, titre, description, logo, "minFollower", "participantCount", budget, whiteList.status ' +
                                        'FROM campaign, "whiteList" whiteList, users ' +
                                        'WHERE campaign.id_campaign = whiteList.id_campaign ' +
                                        'AND whiteList.id_user = users.id_users ' +
                                        'AND users.u_id = $1::text ' +
                                        'GROUP BY campaign.id_campaign, whiteList.status';
}

module.exports = CampaignDao;