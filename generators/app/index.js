'use strict';
var generator = require('yeoman-generator');
var path = require('path');
var fs = require('fs');

var utils = require('./utils');

var Helper = require('./helper');

module.exports = generator.Base.extend({

	initializing: function(){
		this.gen = new Helper(this);
	},

	prompting: function () {
		var self = this;

		if (this.gen.isInited()) {

			this.gen.sayWelcome();

			return this.gen.initPrompt(function(answeres){
				self.gen.createYoRc(answeres);
			});

		} else {

			this.gen.sayWelcomeBack();

		}

	},

	/**
	 * DEFAULTS
	 */
	compose: function(){
		this.gen.callSubGenerator(
			this.gen.getYoRcValue('app.language')
		);
	},

	end: function(){

        this.gen.setYoRcValue('inited',true);

	}
});


