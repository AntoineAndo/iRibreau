
var pg           = require('pg');
var conString    = "postgres://mbfiyemg:KTweF8vtP5FUNGaL1mw_5WUUOePRdofn@fizzy-cherry.db.elephantsql.com:5432/mbfiyemg";
var bcrypt = require('bcryptjs');

function User(){
    this.u_id = 0;
	this.token ="";
	this.username="";
    this.profilePictureUrl = "";
    this.followersCount = 0;
    this.followingCount = 0;

    this.save = function(callback) {
        var client = new pg.Client(conString);
        client.connect();

        console.log(this.u_id + ' - ' + this.username + ' will be saved');

        	query = 'INSERT INTO users(u_id, token, username, profilePictureUrl, followersCount, followingCount) VALUES($1, $2, $3, $4, $5, $6)';
        	data = [
        			this.u_id,
        			this.token,
        			this.username, 
        			this.profilePictureUrl,
        			this.followersCount,
        			this.followingCount
        			];

            client.query(query, data, function (err, result) {
                if(err){
    				client.end();
                    console.log(err);
                    return console.error('query error', err);
                }
            });


            client.query('SELECT * FROM users WHERE u_id = $1', [this.u_id], function(err, result){

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
                    client.end();
                    return callback(null, user);
                }
            });

    };


}


User.findOne = function(id, callback){
	var conString    = "postgres://mbfiyemg:KTweF8vtP5FUNGaL1mw_5WUUOePRdofn@fizzy-cherry.db.elephantsql.com:5432/mbfiyemg";
    var client = new pg.Client(conString);
    client.connect();

    client.query("SELECT * from users where u_id=$1", [id], function(err, result){
        if(err){
            client.end();
            return callback(err, this);
        }
        client.end();

        if (result.rows.length > 0){
            this.u_id = result.rows[0]['u_id'];
            this.token = result.rows[0]['token'];
            this.username = result.rows[0]['username'];
		    this.profilePictureUrl = result.rows[0]['profilepictureurl'];
		    this.followersCount = result.rows[0]['followerscount'];
		    this.followingCount = result.rows[0]['followingcount'];

            return callback(null, this);
        }
        return callback(null, null);


    });
//});
};

User.findById = function(id, callback){
    var client = new pg.Client(conString);

    client.connect();
    client.query("SELECT * from users where u_id=$1", [id], function(err, result){

        if(err){
    		client.end();
            return callback(err, null);
        }
        if (result.rows.length > 0){
            console.log(result.rows[0]['u_id'] + ' found!');
            var user = new User();
            user.u_id= result.rows[0]['u_id'];
            user.token = result.rows[0]['token'];
            user.username = result.rows[0]['username'];
		    user.profilePictureUrl = result.rows[0]['profilepictureurl'];
		    user.followersCount = result.rows[0]['followerscount'];
		    user.followingCount = result.rows[0]['followingcount'];
    		client.end();
            return callback(null, user);
        }
    });
};

User.update = function(result){
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

module.exports = User;

