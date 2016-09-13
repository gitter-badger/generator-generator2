'use strict';

var fs = require('fs');
var yosay = require('yosay');
var walk = require('walk');
var chalk = require('chalk');
var ejs = require('ejs');
var pathJoin = require('path').join;

var utils = require('./utils');
var pac = require('../../package.json');

function Helper(generator){
	this.gen = generator;

	utils.validateAppName(pac.name);

	this.appName = pac.name;
	this.genName = pac.name.split('-')[1];

}

var method = Helper.prototype;

method.isInited = function(){
	return this.gen.config.get('inited') &&
		this.gen.config.get('app') &&
		this.gen.config.get('subgenerator');
};

method.generateBase = function(baseName,done){
	var destinationPath = this.gen.destinationPath('.');
	var setupBasePath = this.gen.templatePath('setup/base');
	var basePath = this.gen.templatePath('base/' + baseName);

	var finish = { setup: false, base: false};

    this.generate(setupBasePath, destinationPath,function(){
		if(finish.base == true) done();
		else finish.setup = true;
	});

	this.generate(basePath,destinationPath,function(){
		if(finish.setup == true) done();
		else finish.base = true;
	});
};

method.generate = function(fromDir,toDir,done){
	var self = this;

	var ejsIgnore = ['gif', 'png', 'ico'];
	var config = self.gen.config.getAll();
	var configWithFsEjs = self.gen.config.getAll();
	configWithFsEjs.ejs = {};

	var fsEjsPath = self.gen.templatePath('setup/ejs');
	var fsEjsFiles = utils.walkSync(fsEjsPath);
	var licensePath = self.gen.templatePath('../../app/templates/licenses/' + self.gen.config.get('app').license);

	//Filling configWithFsEjs...
	for (var i in fsEjsFiles) {
		var fsEjsFile = fsEjsFiles[i];
		var key = fsEjsFile.replace(fsEjsPath + '/', '').replace(/\//g, '_');
		try {
			configWithFsEjs.ejs[key] = ejs.render(
				self.gen.fs.read(fsEjsFile),
				config
			);
		} catch (err) {
			self.fileError(err.message,fsEjsFile);
		}
	}

	//Filling license content to ejs.license
	try {
		configWithFsEjs.ejs.license = ejs.render(
			self.gen.fs.read(licensePath),
			config
		);
	} catch (err) {
		self.fileError(err.message,licensePath);
	}

	var walker = walk.walk(fromDir);
	walker.on("file", function (root, stat, next) {
		var from = pathJoin(root, stat.name);
		try {
			var to = ejs.render(from.replace(fromDir, toDir), config);
			var statNameArr = stat.name.split('.');

			if (ejsIgnore.indexOf(statNameArr[statNameArr.length - 1]) > -1) {
				self.gen.fs.copy(from, to);
			} else {
				self.gen.fs.write(to, ejs.render(self.gen.fs.read(from), configWithFsEjs));
			}

		} catch (err) {
			self.fileError(err.message,from);
		}
		next();
	});

	walker.on('end', done);
};

method.generateModule = function(moduleName,done){
	var destinationPath = this.gen.destinationPath('.');
    var basePath = pathJoin(this.gen.templatePath('module'),moduleName);

	this.generate(basePath, destinationPath,done);
};

method.runLineInjector = function(injectorName){
	var inject = utils.yamlToJson(
        this.gen.templatePath('setup/injector/' + injectorName + '.yml')
    );

	for(var file in inject){
		this.appendToFileLine(
			file,
			inject[file].flag,
			inject[file].text
		);
	}
};

method.appendToFileLine = function(destFile, lineFlag, text){
	var codeArray = text.split('\n');
	var filePath = this.gen.destinationPath(destFile);
	var oldFileLines = this.gen.fs.read(filePath).split('\n');
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

	this.gen.fs.write(destFile,newFileLines.join('\n'));
};

method.fileError = function(message, path){
	throw new Error(chalk.red.bold(
		"\n > Message: " + message + '\n' +
		" > File: " + path + '\n'
	));
};

method.initPrompt = function(questions,callback){

	var self = this;

	return this.gen.prompt(questions.app).then(function (appAnswers) {
		var appLang = appAnswers.language;
		return self.gen.prompt(questions[appLang]).then(function (langAnswers) {

			var answeres = { app: appAnswers };
			answeres[appLang] = langAnswers;

			callback(answeres);

		}.bind(self.gen));
	}.bind(this.gen));

};

method.postPrompt = function(questions,callback){
	return this.gen.prompt(questions).then(function (answeres) {
		callback(answeres);
	}.bind(this.gen));
};

method.createYoRc = function(json){
	var yoRc = {};

	json.app.createdAt = utils.getDate();
	this.gen.config.set(json);

	yoRc[this.appName] = json;

	fs.writeFileSync(
		this.gen.destinationPath('.yo-rc.json'),
		JSON.stringify(yoRc, null, 4)
	);
};

method.callSubGenerator = function(subGenerator){
	this.gen.composeWith(
		this.genName + ':' + subGenerator, {}, {
			local: pathJoin(__dirname, '..',subGenerator)
		}
	);
};

method.getYoRcValue = function (keys){
    return utils.getJsonValue(
        keys.split('.'),
        this.gen.config.getAll()
    );
};

method.setYoRcValue = function(keys,value){
	var newJson = utils.setJsonValue(
		keys.split('.'),
		value,
		this.gen.config.getAll()
	);

	this.gen.config.set(newJson);

};

method.sayWelcome = function(){
	this.gen.log(yosay([
		"♥ Java ♥",
		"♥ TypeScript ♥",
		"♥ Node ♥",
		"♥ Python ♥"
	].join('\n')));
};
method.sayWelcomeBack = function(){
	this.gen.log(yosay([
		this.gen.config.get('app').authorName,
		"♥",
		this.gen.config.get('app').name
	].join(' ')));
};
method.sayGoodBye = function(){
	this.gen.log([
		'',
		' ♥ Yeoman loves you! ♥'
	].join('\n'));
};

module.exports = Helper;
