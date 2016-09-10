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
	var PROMPT = (this.config.get('subgenerator') == null || this.config.get('inited') == null ? 'base' : 'module');
	var Q = prompt.subgenerator(
		fs.readdirSync(self.templatePath('base')),
		fs.readdirSync(self.templatePath('module'))
	);

	return self.prompt(Q.subgenerator[PROMPT]).then(function (A0) {
		self.props = A0;
	}.bind(self));

};

exports.configuring = function () {
	//Todo: Make checking for this.props.module so injection will not inject 2*.
	if (this.props.base)
		this.config.set('subgenerator', this.props);
};

exports.writing = function () {
	var destPath = this.destinationPath('.');
	var fsBasePath = this.templatePath('setup/base');
	var basePath;
	var done = this.async();
	var finish = { basePath : false, fsBasePath: false };

	if (this.props.base)
		basePath = pathJoin(this.templatePath('base'), this.props.base);
	else
		basePath = pathJoin(this.templatePath('module'),this.props.module);

	if(this.props.base)
        this._walkWithEjs(fsBasePath,destPath,function(){
			finish.fsBasePath = true;
			if(finish.basePath) done();
		});
	else{
		finish.fsBasePath = true;
	}

	this._walkWithEjs(basePath,destPath,function(){
		finish.basePath = true;
		if(finish.fsBasePath) done();
	});
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

	var inject = utils.yamlToJson(pathJoin(
		this.templatePath('setup/injector'),
		method + '.yml'
	));

	for(var file in inject){
		this._appendToFileLine(
			file,
			inject[file].flag,
			inject[file].text
		);
	}

	self[method]();
};

/**
 * This method will walk dir and replace file and path ejs templates strings with yo-rc json
 * configuration and put names of all defaults file in ejs configuration and place values
 * as content of the same file... ejs.fun.file[fileNameFromDefault] = contentOfTheSameFileFromDefault.
 *
 * !!! ejs.fun.file.licence = licences[app.licence].readFile()
 *
 * @param fromDir
 * @param toDir
 * @param done
 * @private
 */
exports._walkWithEjs = function (fromDir, toDir, done) {
	var self = this;

	var ejsIgnore = ['gif','png','ico'];
	var config = self.config.getAll();
	var configWithFsEjs = self.config.getAll();
	configWithFsEjs.ejs = {};

	var fsEjsPath = self.templatePath('setup/ejs');
	var fsEjsFiles = utils.walkSync(fsEjsPath);
	var licensePath = pathJoin(self.templatePath(), '../../app/templates/licenses', self.config.get('app').license);

	//Filling configWithFsEjs...
	for (var i in fsEjsFiles) {
		var fsEjsFile = fsEjsFiles[i];
    	var key = fsEjsFile.replace(fsEjsPath + '/', '').replace(/\//g, '_');
		try{
			configWithFsEjs.ejs[key] = ejs.render(
				self.fs.read(fsEjsFile),
				config
			);
		} catch(err){
			throw new Error(chalk.red.bold(
				"\n > Message: " + err.message + '\n' +
				" > File: " + fsEjsFile + '\n'
			));
		}
	}

	//Filling license content to ejs.license
	try{
		configWithFsEjs.ejs.license = ejs.render(
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

			if(ejsIgnore.indexOf(statNameArr[statNameArr.length-1]) > -1){
				self.fs.copy(from,to);
			}else{
				self.fs.write(to,ejs.render(self.fs.read(from),configWithFsEjs));
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
exports._appendToFileLine = function(destFile,lineFlag,text){
	var codeArray = text.split('\n');
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

	this.fs.write(destFile,newFileLines.join('\n'));
};
