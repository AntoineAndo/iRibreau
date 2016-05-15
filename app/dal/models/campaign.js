module.exports = function Campaign(){

	// the campaign's id
    this.campaign_id = 0;

    // the campaign's creator
    this.owner_id = 0;

    // the campaign's title
    this.title = "";

    // the campaign's description
    this.description = "";

    // the campaign's logo (bytes data)
    this.logo = "";

    // the minimum amount of followers for the campaign
    this.minFollower = 0;

    // the amount of people currently participating to the campaign
    this.participantCount = 0;

    // the campaign's budget
    this.budget = 0;
}