/**
* Data access layer for users
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
var User = require(appDir + '/app/dal/models/user');

function UserDao(){

    db = new Database();
    var conString = db.getConnectionString();

    this.save = function(newUser, callback) {

        var client = new pg.Client(conString);
        client.connect();

        console.log(newUser.u_id + ' - ' + newUser.username + ' will be saved');

        data = [
                newUser.u_id,
                newUser.token,
                newUser.username, 
                newUser.profilePictureUrl,
                newUser.followersCount,
                newUser.followingCount
                ];

        client.query(QUERY_INSERT_NEW_USER, data, function (err, result) {
            if(err){
                client.end();
                console.log(err);
                return console.error('query error', err);
            }
        });

        client.query(QUERY_FIND_USER_BY_ID, [newUser.u_id], function(err, result){

            if(err){
                return callback(null);
            }
            //if no rows were returned from query, then new user
            if (result.rows.length == 1){
                console.log(result.rows[0]);
                console.log(result.rows[0]['u_id'] + ' found!');
                var user = new User();
                user.u_id= result.rows[0]['u_id'];
                user.token = result.rows[0]['token'];
                user.username = result.rows[0]['username'];
                user.profilePictureUrl = result.rows[0]['profilepictureurl'];
                user.followersCount = result.rows[0]['followerscount'];
                user.followingCount = result.rows[0]['followingcount'];
                user.user_id = result.rows[0]['user_id'];
                client.end();
                return callback(null, user);
            }
        });
    };

    this.findOne = function(id, callback){
        var client = new pg.Client(conString);
        client.connect();

        client.query(QUERY_FIND_USER_BY_ID, [id], function(err, result){

            client.end();

            if(err){
                return callback(err, null);
            }

            if (result.rows.length > 0){
                user = generateUserFromQuery(result, 0);
                return callback(null, user);
            }
            return callback(null, null);
        });
    };

    this.findById = function(id, callback){
        var client = new pg.Client(conString);

        client.connect();
        client.query(QUERY_FIND_USER_BY_ID, [id], function(err, result){

            client.end();

            if(err){
                return callback(err, null);
            }
            
            if (result.rows.length > 0){
                console.log(result.rows[0]['u_id'] + ' found!');
                var user = generateUserFromQuery(result, 0);
                client.end();
                return callback(null, user);
            }
        });
    };

    this.update = function(result){
        parameters = {};
        fields = [];
        result.forEach(function(param){
            fields.push(param[0]);
            parameters[param[0]] = param[1];
        });
        console.log(parameters);
        fields.shift();

        query = "UPDATE USERS SET u_id = "+parameters['u_id'];

        fields.forEach(function(field){
            query += ", "+field+" = '"+parameters[field]+"' ";
        });
        query += "WHERE u_id like '"+parameters['u_id']+"';";

        var client = new pg.Client(conString);

        console.log(query);

        client.connect();
        client.query(query, function(err, result){

          //  console.log(result);
            console.log(err);
            client.end();
        });
    }

    // Create a new json object from query result
    function generateUserFromQuery(result, rowIndex){
        var user = new User();
        user.u_id= result.rows[rowIndex]['u_id'];
        user.token = result.rows[rowIndex]['token'];
        user.username = result.rows[rowIndex]['username'];
        user.profilePictureUrl = result.rows[rowIndex]['profilepictureurl'];
        user.followersCount = result.rows[rowIndex]['followerscount'];
        user.followingCount = result.rows[rowIndex]['followingcount'];
        return user;
    }


    /**
    * QUERIES
    **/

    QUERY_INSERT_NEW_USER = 'INSERT INTO users(u_id, token, username, profilePictureUrl, followersCount, followingCount) VALUES($1, $2, $3, $4, $5, $6)';

    QUERY_FIND_USER_BY_ID = 'SELECT * FROM users WHERE u_id = $1';

}

module.exports = UserDao;