'use strict';

var utils = require('./utils');
var fs = require('fs');
var pathJoin = require('path').join;
var prompt = require('./prompt');
var yosay = require('yosay');

/**
 * Default subgenerator methods that will be executed when subgenerator is started.
 */
exports.prompting = function () {
	var self = this;

	var PROMPT = (this.config.get('subgenerator') == null ? 'base' : 'module');
	var Q = prompt.subgenerator(
		fs.readdirSync(self.templatePath('base')),
		fs.readdirSync(self.templatePath('module'))
	);

	return self.prompt(Q.subgenerator[PROMPT]).then(function (A0) {
		self.props = A0;
	}.bind(self));

};

exports.configuring = function () {
	if (this.props.base)
		this.config.set('subgenerator', this.props);
};

exports.writing = function () {
	var self = this;
	if (self.props.base) {

		var fromDir = pathJoin(self.templatePath('base'), self.props.base);
		var toDir = self.destinationPath('.');
		var config = self.config.getAll();

		utils.walkWithEjs(fromDir,toDir,config,function(from,to){
			self.fs.copyTpl(from, to,config);
		},this.async());

	}
	else{
		if(!(self.props.module in self))
			throw new ReferenceError('Subgenerator(' + self.config.get('app').language + ') is missing "' + self.props.module + '" method!');
		self.log(self.config.get('app').language + '.' + self.props.module + ' start...');
		self[self.props.module]();
		self.log(self.config.get('app').language + '.' + self.props.module + ' finish...');

	}
};

