function Database(){
	this.databaseType = 'postgres';
	this.user = 'mbfiyemg';
	this.password = 'KTweF8vtP5FUNGaL1mw_5WUUOePRdofn';
	this.hostname = 'fizzy-cherry.db.elephantsql.com';
	this.port = '5432';
	this.databaseName = 'mbfiyemg';

	this.getConnectionString = function(){
		var connectionString = "";
		connectionString = connectionString.concat(
			this.databaseType, '://',
			this.user, ':',
			this.password, '@',
			this.hostname, ':',
			this.port, '/',
			this.databaseName
		);
		return connectionString;
	}
}

module.exports = Database;