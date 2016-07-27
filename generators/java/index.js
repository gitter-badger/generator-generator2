'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');
var Q = require('./prompt.json');

module.exports = yeoman.Base.extend({
	prompting: function () {
		var self = this;

		var forAllTemps = fs.readdirSync(this.templatePath('_forAll'));
		var dirList = fs.readdirSync(this.sourceRoot());

		if (!this.config.get('projectType')) {

			for(var i in dirList){
				if(dirList[i] != "_forAll")
					Q.projectType[0].choices.push(dirList[i]);
			}

			return this.prompt(Q.projectType).then(function (A0) {
				self.props = A0;

				Q.templates[0].choices = fs.readdirSync(this.templatePath(A0.projectType));
				for(var i in forAllTemps)
					Q.templates[0].choices.push(forAllTemps[i]);

				return self.prompt(Q.templates).then(function(A1){
					self.props.templates = A1.templates;
				});

			}.bind(this));
		}
	},
	configuring: function () {
		this.log(this.props);
	}
});
