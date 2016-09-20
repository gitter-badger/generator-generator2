'use strict';

var yeoman = require('yeoman-generator');
var generator = require('../app/generator');

module.exports = yeoman.Base.extend({

	/**
	 * Base templates...
	 */

    shell: function(){ },
    javaFx: function(){ },
    CLI : function(){ },

	/**
	 * Module templates...
	 */

    database: function(){ }

}).extend(generator);
