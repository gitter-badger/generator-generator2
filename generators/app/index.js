'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var Q = require('./prompt');

module.exports = yeoman.Base.extend({
	prompting: function () {
		var self = this;

		this.log(yosay("Welcome to the delightful generator-generate generator!"));

		return this.prompt(Q.subgenerator).then(function (A0) {
			self.props = A0;
		}.bind(this));
	},

	configuring: function () {
		this.config.set(this.props);
		this.composeWith('generate:' + this.props.subgenerator);
	}

});
