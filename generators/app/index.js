'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var utils = require('./lib/utils');
var pathJoin = require('path').join;

var Q = require('./lib/prompt').generator();

module.exports = yeoman.Base.extend({
	prompting: function () {
		var self = this;

		if(!this.config.get('inited')){
			this.log(yosay(Q.yosay));

			return this.prompt(Q.generator).then(function (A0) {
				self.props = {
					app : A0
				};
				self._configuring();
				self._writing();
			}.bind(this));
		} else {
			this.composeWith('generate:' + this.config.get('app').language);
		}

	},

	_configuring: function () {
		this.config.set(this.props);
		this.composeWith('generate:' + this.props.app.language);
	},

	_writing: function(){
		var self = this;

		/**
		 * Set defaults file
		 */
		var fromDir = self.templatePath('defaults');
		var toDir = self.destinationPath('.');
		var config = self.config.getAll();
		utils.walkWithEjs(fromDir,toDir,config,function(from,to){
			self.fs.copyTpl(from, to,config);
		},this.async());

		/**
		 * Set license...
		 */
		self.fs.copyTpl(
			pathJoin(self.templatePath('licences'),this.props.app.license),
			pathJoin(toDir,'LICENSE.md'),
			config
		);
	},

	end: function(){
		this.config.set('inited',true);
		this.log('Yeoman generation finish...');
	}
});
