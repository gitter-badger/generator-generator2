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
		var config = this.config.getAll();

		utils.walkWithEjs(fromDir,toDir,config,function(from,to){
			self.fs.copyTpl(from, to,config);
		},this.async());
	},
	database: function(){
		var self = this;
		
		this.log('Execute database');

		var fromDir = pathJoin(this.templatePath('module'),this.props.module);
		var toDir = this.destinationPath('.');
		var config = this.config.getAll();

		utils.walkWithEjs(fromDir,toDir,config,function(from,to){
			self.fs.copyTpl(from, to,config);
		},this.async());
	}
}).extend(subgenerator);
