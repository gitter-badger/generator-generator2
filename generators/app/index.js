'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var Q = require('./lib/prompt').generator();

module.exports = yeoman.Base.extend({
	prompting: function () {
		var self = this;

		if(!this.config.get('inited')){
			this.log(yosay(Q.yosay));

			return this.prompt(Q.generator).then(function (A0) {
				self.props = A0;
				self._configuring();
			}.bind(this));
		} else {
			this.composeWith('generate:' + this.config.get('subgenerator'));
		}

	},

	_configuring: function () {
		this.config.set(this.props);
		this.composeWith('generate:' + this.props.subgenerator);
	}

});
