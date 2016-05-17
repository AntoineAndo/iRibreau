module.exports = function User(){

    // The user's id
    this.user_id = 0;

    // The user's instagram id
    this.u_id = 0;

    // The token returned by the instagram API
	this.token ="";

    // The user's instagram username
	this.username="";

    // The URL for the user's instagram profile picture
    this.profilePictureUrl = "";

    // The amount of followers for this user
    this.followersCount = 0;

    // The amount of people that this user is following
    this.followingCount = 0;
}