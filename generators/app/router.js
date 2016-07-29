'use strict';

var fs = require('fs');
var walk = require('walk');
var pathJoin = require('path').join;
var ejsRender = require('ejs').render;

exports.prompting = function () {
	var self = this;

	var Q = {
		"base": [
			{
				"type": "list",
				"name": "base",
				"message": "Select project base:",
				"choices": fs.readdirSync(self.templatePath('base'))
			}
		],
		"module": [
			{
				"type": "list",
				"name": "module",
				"message": "Select module generator:",
				"choices": fs.readdirSync(self.templatePath('module'))
			}
		]
	};
	var PROMPT = (this.config.get('base') == null ? 'base' : 'module');

	return self.prompt(Q[PROMPT]).then(function (A0) {
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

		var base = pathJoin(self.templatePath('base'), self.props.base);
		var destBase = self.destinationPath('.');
		var walker = walk.walk(base);
		walker.on("file", function (root, stat, next) {
			var from = pathJoin(root, stat.name);
			var to = ejsRender(from.replace(base, destBase), self.config.getAll());
			self.fs.copyTpl(from, to, self.config.getAll());
			next();
		});
	}
};
