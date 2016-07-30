'use strict';

var utils = require('./utils');
var fs = require('fs');
var pathJoin = require('path').join;
var prompt = require('./prompt');
var yosay = require('yosay');

exports.prompting = function () {
	var self = this;

	var PROMPT = (this.config.get('base') == null ? 'base' : 'module');
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
		this.config.set('base', this.props.base);
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
			throw new ReferenceError('Subgenerator(' + self.config.get('subgenerator') + ') is missing "' + self.props.module + '" method!');
		self[self.props.module]();
	}
};

exports.end = function(){
	this.config.set('inited',true);
};
