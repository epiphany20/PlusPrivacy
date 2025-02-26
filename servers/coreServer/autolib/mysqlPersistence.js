/**
 * Created by ciprian on 09.03.2017.
 */

/*
    Mysql is also needed for some analytics tasks so be careful with the exclusions
 */
excludeFromAdapters(["DefaultLogger","SwarmMonitor","EmailAdapter","CrawlerAdapter"]);

var mysql     = require('mysql');
var container = require('safebox').container;
var apersistence = require('apersistence');

var connectionSettings = {
    connectionLimit:10,
    host     : thisAdapter.config.Core.mysqlHost,
    port     : thisAdapter.config.Core.mysqlPort,
    user     : 'root',
    password : thisAdapter.config.Core.mysqlDatabasePassword,
    database : thisAdapter.config.Core.mysqlDatabaseName
}

var mysqlConnection = mysql.createPool(connectionSettings);
container.resolve('mysqlConnection',mysqlConnection);

container.declareDependency("mysqlPersistence",['mysqlConnection'],function(outOfService,mysqlConnection){
    if(outOfService){
        console.log("MySQL persistence failed");
    }else{
        console.log("Initialising MySQL persistence");
        return apersistence.createMySqlPersistence(mysqlConnection);
    }
});