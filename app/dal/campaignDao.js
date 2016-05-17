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
    this.saveNewCampaign = function(campaign, callback) {
        var client = new pg.Client(conString);
        client.connect();

    	query = QUERY_INSERT_NEW_CAMPAIGN;
        console.log("insertion owner_id : " + campaign.owner_id);
    	data = [
    			campaign.title,
    			campaign.description, 
                campaign.logo,
    			campaign.minFollower,
    			campaign.participantCount,
    			campaign.budget,
                campaign.owner_id,
                campaign.status
    			];

        client.query(query, data, function (err, result) {
            console.log("Query result : " + result);
            if(err){
    			client.end();
                return callback(err, null);
            }
            return callback(null, result);
        });
    }

    // Finds one campaign by id
    this.findCampaignById = function(id, callback){
        var client = new pg.Client(conString);

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
    this.getCampaignsByOwner = function(id, callback){
        var client = new pg.Client(conString);

        console.log('attempting to retreive campaigns for this owner : ' + id);

        client.connect();
        client.query(QUERY_FIND_CAMPAIGNS_BY_OWNER, [id], function(err, result){

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
    this.getCampaignsByUserSubscription = function(id, callback){
        var client = new pg.Client(conString);

        console.log('attempting to retreive subscriptions for this owner : ' + id);

        client.connect();
        client.query(QUERY_FIND_CAMPAIGNS_BY_USER_SUBSCRIPTION, [id], function(err, result){

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

    // Updates the campaign
    this.updateCampaign = function(parameters){

        query = buildUpdateQuery(parameters);

        var client = new pg.Client(conString);

        console.log(query);

        client.connect();
        client.query(query, function(err, result){

            client.end();
            if(err){
                console.log(err);
            }
        });
    }

    // Deletes the campaign
    this.deleteCampaign = function(campaign){
        client.connect();
        client.query(QUERY_DELETE_CAMPAIGN, [id], function(err, result){

            client.end();
            if(err){
                console.log(err);
            }
        });
    }

    function buildUpdateQuery(parameters){

        fields = [];
        parameters.forEach(function(param){
            fields.push(param[0]);
            parameters[param[0]] = param[1];
        });
        console.log(parameters);
        fields.shift();

        query = "UPDATE campaign SET";

        fields.forEach(function(field, index, fieldArray){
            query += " "+field+" = '"+parameters[field]+"'";
            if(index != fieldArray.length - 1){
                query += ", ";
            }
        });

        query += "WHERE campaign_id like '"+parameters['campaign_id']+"';";

        return query;
    }

    // Create a new json object from query result
    function generateCampaignFromQuery(result, rowIndex){
        var campaign = new Campaign();
        campaign.campaign_id= result.rows[rowIndex]['campaign_id'];
        campaign.owner_id = result.rows[rowIndex]['owner_id'];
        campaign.title = result.rows[rowIndex]['titre'];
        campaign.description = result.rows[rowIndex]['description'];
        campaign.logo = result.rows[rowIndex]['logo'];
        campaign.minFollower = result.rows[rowIndex]['minFollower'];
        campaign.participantCount = result.rows[rowIndex]['participantCount'];
        campaign.budget = result.rows[rowIndex]['budget'];
        campaign.status = result.rows[rowIndex]['status_id'];
        campaign.whiteliststatus = result.rows[rowIndex]['campaignwhiteliststatus_id'];
        return campaign;
    }

    /**
    * QUERIES
    **/

    QUERY_INSERT_NEW_CAMPAIGN = 'INSERT INTO campaign(titre, description, logo, "minFollower", "participantCount", budget, owner_id, status_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';

    QUERY_FIND_CAMPAIGNS = 'SELECT * from campaign';

    QUERY_FIND_CAMPAIGN_BY_ID = 'SELECT * from campaign where campaign_id=$1';

    QUERY_FIND_CAMPAIGNS_BY_OWNER = 'SELECT campaign_id, titre, description, logo, "minFollower", "participantCount", budget, owner_id, status_id ' +
                                    'FROM campaign, users ' +
                                    'WHERE campaign.owner_id = users.user_id ' +
                                    'AND users.u_id like $1';

    QUERY_FIND_CAMPAIGNS_BY_USER_SUBSCRIPTION = 'SELECT campaign.campaign_id, titre, description, logo, "minFollower", "participantCount", budget, owner_id, status_id, whiteList.campaignwhiteliststatus_id ' +
                                        'FROM campaign, "campaignwhitelist" whiteList, users ' +
                                        'WHERE campaign.campaign_id = whiteList.campaign_id ' +
                                        'AND whiteList.user_id = users.user_id ' +
                                        'AND users.u_id like $1 ' +
                                        'GROUP BY campaign.campaign_id, whiteList.campaignwhiteliststatus_id';

    QUERY_DELETE_CAMPAIGN = 'DELETE FROM campaign where campaign_id=$1';
}

module.exports = CampaignDao;