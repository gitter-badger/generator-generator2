'use strict';

var utils = require('./utils');
var fs = require('fs');
var pathJoin = require('path').join;
var prompt = require('./prompt');
var yosay = require('yosay');
var ejs = require('ejs');
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
	var toDir = self.destinationPath('.');
	var defaultDir = pathJoin(self.sourceRoot(),'../../app/templates/default');

	if (self.props.base) {
		var fromDir = pathJoin(self.templatePath('base'), self.props.base);
	}
	else{
		var fromDir = pathJoin(this.templatePath('module'),this.props.module);
	}

	self._walkWithEjs(fromDir,toDir,self.async());
	self._walkWithEjs(defaultDir,toDir,function(){});
};

exports.conflicts = function(){
	var self = this;

	if (self.props.base)
		var method = self.props.base;
	else
        var method = self.props.module;

	if(!(method in self))
		throw new ReferenceError(
			'Subgenerator(' + self.config.get('app').language + ') is missing "' +
			method + '" method!'
		);

	self[method]();
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
	configAll.file = {};

	var defaultsDir = pathJoin(self.sourceRoot(),'../../app/templates/file');
	var defaultFiles = utils.walkSync(defaultsDir);

	for (var i in defaultFiles) {
		var defaultFile = defaultFiles[i];
    	var key = defaultFile.replace(defaultsDir + '/', '').replace(/\//g, '_');
		try{
			configAll.file[key] = ejs.render(
				self.fs.read(defaultFile),
				config
			);
		} catch(err){
			throw new Error(chalk.red.bold(
				"\n > Message: " + err.message + '\n' +
				" > File: " + defaultFile + '\n'
			));
		}
	}

	var licensePath = pathJoin(defaultsDir, '../licenses', self.config.get('app').license);
	try{
		configAll.file.license = ejs.render(
			self.fs.read(licensePath),
			config
		);
	} catch (err){
		throw new Error(chalk.red.bold(
			"\n > Message: " + err.message + '\n' +
			" > File: " + licensePath + '\n'
		));
	}

	var walker = walk.walk(fromDir);
	walker.on("file", function (root, stat, next) {
		var from = pathJoin(root, stat.name);
		try{
			var to = ejs.render(from.replace(fromDir, toDir), config);
			var statNameArr = stat.name.split('.');

			if(['gif','png','ico'].indexOf(statNameArr[statNameArr.length-1]) > -1){
				self.fs.copy(from,to);
			}else{
				self.fs.write(to, utils.decodeHtmlChars(
					ejs.render(self.fs.read(from),configAll)
				));
			}

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

/**
 * This method will append code array after the line where is located lineFlag.
 *
 * @param destFile
 * @param lineFlag
 * @param codeArray
 * @private
 */
exports._appendToFileLine = function(destFile,lineFlag,codeArray){
	var filePath = this.destinationPath(destFile);

	var oldFileLines = this.fs.read(filePath).split('\n');
	var newFileLines = [];
	var lineFlagFound = false;

	for(var i=0;i<oldFileLines.length;i++){
		newFileLines.push(oldFileLines[i]);

		if(oldFileLines[i].indexOf(lineFlag) != -1){
			lineFlagFound = true;
			var whiteSpaces = '';
			for(var j=0;j<oldFileLines[i].length;j++){
				if(oldFileLines[i][j] == '\t' || oldFileLines[i][j] == ' '){
					whiteSpaces += oldFileLines[i][j];
					continue;
				} else {
					break;
				}
			}
			newFileLines.push(whiteSpaces + codeArray.join('\n' + whiteSpaces));
		}
	}
	if(!lineFlagFound){
		throw new ReferenceError(chalk.red.bold(
			"\n > Message: Line flag (" + lineFlag + ") not found!\n" +
			" > File: " + filePath + '\n'
		));
	}

	var newFile = utils.decodeHtmlChars(newFileLines.join('\n'));
	this.fs.write(destFile,newFile);
};
