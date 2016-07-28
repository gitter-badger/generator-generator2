'use strict';

var yeoman = require('yeoman-generator');
var fs = require('fs');
var Q = require('./prompt');
var walk = require('walk');

var pathJoin = require('path').join;
var ejsRender = require('ejs').render;

module.exports = yeoman.Base.extend({

	prompting: function () {
		var self = this;
		var PROMPT = (this.config.get('base') == null ? 'base' : 'module');

		Q[PROMPT][0].choices = fs.readdirSync(self.templatePath(PROMPT));
		return self.prompt(Q[PROMPT]).then(function (A0) {
			self.props = A0;
		}.bind(self));

	},

	configuring: function () {
		if (this.props.base)
			this.config.set('base', this.props.base);
	},

	writing: function () {
		var self = this;

		if (self.props.base) {

			var base = pathJoin(self.templatePath('base'), self.props.base);
			var destBase = self.destinationPath('.');
			var walker = walk.walk(base);
			walker.on("file", function (root, stat, next) {
				var from = pathJoin(root,stat.name);
				var to = ejsRender(from.replace(base,destBase),self.config.getAll());
				self.fs.copyTpl(from,to, self.config.getAll());
				next();
			});
		}
	},

	renaming: function(){
		var self = this;
	}
});
