'use strict';
var generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var utils = require('./lib/utils');

var Q = require('./lib/prompt').generator();

module.exports = generator.Base.extend({
	prompting: function () {
		var self = this;

		if(!this.config.get('inited')){
			this.log(yosay(Q.yosay));

			return this.prompt(Q.generator).then(function (A0) {
				self.props = {
					app : A0
				};
				self._configuring();
			}.bind(this));
		} else {
			this.composeWith('generate:' + this.config.get('app').language);
		}

	},

	_configuring: function () {
		this.config.set(this.props);
		this.composeWith('generate:' + this.props.app.language);
	},

	end: function(){
		
		if(!this.config.get('inited'))
			this.config.set('inited',true);
		
		this.log('\nYeoman generation finish...');
	}
});


