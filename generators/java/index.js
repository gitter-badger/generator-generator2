'use strict';

var yeoman = require('yeoman-generator');
var subgenerator = require('../app/lib/subgenerator');

var buildGradle = {
    src : "build.gradle",
    flag : "//Yeoman:libs"
};

module.exports = yeoman.Base.extend({

	/**
	 * Base templates...
	 */

    shell: function(){
        this._appendToFileLine( buildGradle.src, buildGradle.flag,[
            "compile 'org.springframework.shell:spring-shell:1.2.0.RELEASE'"
        ]);
    },
    javaFx: function(){
        this._appendToFileLine( buildGradle.src, buildGradle.flag,[
            "compile 'com.airhacks:afterburner.fx:1.6.2'",
            "compile 'org.commonjava.googlecode.markdown4j:markdown4j:2.2-cj-1.0'",
            "compile 'javax.inject:javax.inject:1'"
        ]);
    },
    CLI : function(){
		this.log('\n Todo:');
		this.log([
			'  * Execute gradle versionEyeCreate and replace readmes VERSIONEYE_PROJECT_ID with gradle.properties(versioneye.projectid).',
			'  * Replace readmes CODEBEAT_PROJECT_ID with actual codebeat project id.',
			'  * Make first push to activate readme.md badges.'
		].join('\n'));
    },

	/**
	 * Module templates...
	 */

    database: function(){
        this._appendToFileLine( buildGradle.src, buildGradle.flag,[
            "compile 'org.neo4j:neo4j-ogm-core:2.0.4'",
            "compile 'org.neo4j:neo4j-ogm-http-driver:2.0.4'",
            "compile 'org.neo4j:neo4j-ogm-embedded-driver:2.0.4'",
            "compile 'org.neo4j:neo4j-ogm-bolt-driver:2.0.4'"
        ]);
    }
}).extend(subgenerator);
