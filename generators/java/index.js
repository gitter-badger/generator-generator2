'use strict';

var yeoman = require('yeoman-generator');
var subgenerator = require('../app/lib/subgenerator');
var utils = require('../app/lib/utils');
var pathJoin = require('path').join;

module.exports = yeoman.Base.extend({
	javafx: function () {
		var self = this;

		this.log('Execute javafx');

		var fromDir = pathJoin(this.templatePath('module'),this.props.module);
		var toDir = this.destinationPath('.');

		self._walkWithEjs(fromDir,toDir,self.async());
	},
	database: function(){
		var self = this;

		this.log('Add build.gradle libs... find for //Generate:libs in build.gradle and add libs after this line...');

		var fromDir = pathJoin(this.templatePath('module'),this.props.module);
		var toDir = this.destinationPath('.');

		self._walkWithEjs(fromDir,toDir,self.async());
	}
}).extend(subgenerator);
