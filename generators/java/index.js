'use strict';

var yeoman = require('yeoman-generator');
var generator = require('../app/generator');

/**
 * Subgenerator with extended generator methods.
 * @module java
 */
module.exports = yeoman.Base.extend({

	/**
	 * Generator shell method.
	 */
    shell: function(){ },
	
	/**
	 * Generator javaFx method.
	 */
    javaFx: function(){ },
	
	/**
	 * Generator CLI method.
	 */
    CLI : function(){ },


	/**
	 * Generator database method.
	 */
    database: function(){ }

}).extend(generator);
