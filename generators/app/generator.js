'use strict';

var utils = require('./utils');
var questions = require('./questions');
var fs = require('fs');
var pathJoin = require('path').join;

var Helper = require('./helper');

exports.initializing = function(){
	this.gen = new Helper(this);
	this.answeres = {};
};

/**
 * Todo: Make filter of modules base on subgenerator.module
 */
exports.prompting = function () {
	var self = this;

	var questionChoices = questions.subgenerator(
		fs.readdirSync(self.templatePath('base')),
		fs.readdirSync(self.templatePath('module'))
	)[this.gen.isInited() ? 'module' : 'base'];

	return this.gen.postPrompt(
		questionChoices,
		function(answeres){

			self.answeres = answeres;

		});

};

exports.configuring = function(){

	if(!this.gen.isInited()) {
		var yoRc = this.answeres;
		yoRc.module = [];
		this.gen.setYoRcValue('subgenerator', yoRc);
	} else
		this.gen.setYoRcValue(
			'subgenerator.module',
			this.gen.getYoRcValue('subgenerator.module').push(
				this.answeres.module
			)
		)
};

exports.writing = function () {
	var done = this.async();

	if (this.gen.isInited())
		this.gen.generateModule( this.answeres.module, done);
	else
		this.gen.generateBase(this.answeres.base, done);
};

exports.conflicts = function(){
	var self = this;

	if (self.gen.isInited())
        var method = self.answeres.module;
	else
		var method = self.answeres.base;

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
