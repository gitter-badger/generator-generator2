'use strict';

var utils = require('./utils');
var fs = require('fs');
var pathJoin = require('path').join;
var prompt = require('./prompt');
var yosay = require('yosay');
var ejsRender = require('ejs').render;
var walk = require('walk');
var chalk = require('chalk');

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

		self._walkWithEjs(fromDir,toDir,self.async());

	}
	else{
		if(!(self.props.module in self))
			throw new ReferenceError('Subgenerator(' + self.config.get('app').language + ') is missing "' + self.props.module + '" method!');

		self[self.props.module]();

	}
};

/**
 * This method will walk dir and replace file and path ejs templates strings with yo-rc json
 * configuration and put names of all defaults file in ejs configuration and place values
 * as content of the same file... ejs.config.file[fileNameFromDefault] = contentOfTheSameFileFromDefault.
 *
 * !!! ejs.config.file.licence = licences[app.licence].readFile()
 *
 * @param fromDir
 * @param toDir
 * @param done
 * @private
 */
exports._walkWithEjs = function (fromDir, toDir, done) {
	var self = this;
	var config = self.config.getAll();
	var configAll = self.config.getAll();
	configAll.files = {};

	var defaultsDir = pathJoin(self.sourceRoot(),'../../app/templates/defaults');

	//Todo: Check if this works for subgenerators methods.
	var defaultFiles = fs.readdirSync(defaultsDir);
	for (var i in defaultFiles) {
		var defaultFile = defaultFiles[i];

		try{
			configAll.files[defaultFile] = ejsRender(self.fs.read(pathJoin(defaultsDir, defaultFile)), config);
		} catch(err){
			throw new Error(chalk.red.bold(
				"\n > Message: " + err.message + '\n' +
				" > File: " + pathJoin(defaultsDir,defaultFile) + '\n'
			));
		}
	}

	try{
		configAll.files.license = ejsRender(self.fs.read(pathJoin(defaultsDir,'../licenses', self.config.get('app').license)), config);
	} catch (err){
		throw new Error(chalk.red.bold(
			"\n > Message: " + err.message + '\n' +
			" > File: " + pathJoin(defaultsDir,defaultFile) + '\n'
		));
	}

	var walker = walk.walk(fromDir);
	walker.on("file", function (root, stat, next) {
		var from = pathJoin(root, stat.name);
		try{
			var to = ejsRender(from.replace(fromDir, toDir), config);
			self.fs.copyTpl(from, to, configAll);
		} catch (err){
			throw new Error(chalk.red.bold(
				"\n > Message: " + err.message + '\n' +
				" > File: " + from + '\n'
			));
		}
		next();
	});

	walker.on('end', function () {
		done();
	});
};
