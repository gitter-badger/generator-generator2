'use strict';

var yeoman = require('yeoman-generator');
var subgenerator = require('../app/lib/subgenerator');

module.exports = yeoman.Base.extend({
	database: function(){
		this._appendToFileLine( "build.gradle", "//Yeoman:libs", [
			"compile 'org.neo4j:neo4j-ogm-core:2.0.4'",
			"compile 'org.neo4j:neo4j-ogm-http-driver:2.0.4'",
			"compile 'org.neo4j:neo4j-ogm-embedded-driver:2.0.4'",
			"compile 'org.neo4j:neo4j-ogm-bolt-driver:2.0.4'"
        ]);
	}
}).extend(subgenerator);
