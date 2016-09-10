'use strict';

var yeoman = require('yeoman-generator');
var generator = require('../app/generator');

module.exports = yeoman.Base.extend({

	/**
	 * Base templates...
	 */

    shell: function(){ },
    javaFx: function(){ },
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

    database: function(){ }

}).extend(generator);
