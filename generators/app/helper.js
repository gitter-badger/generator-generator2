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

	utils.validateGeneratorName(pac.name);

	this.ENV = {
		name : {
			app : pac.name,
			generator : pac.name.split('-')[1]
		},
		path : {
			getSubgenerator : function(name){ return pathJoin(__dirname,'..',name)},
			getDestination : function() {return generator.destinationPath('.')},
			temp : {
				getSetupBase : function() { return generator.templatePath('setup/base');},
				getSetupEjs : function(){ return generator.templatePath('setup/ejs');},
				getBase : function(name){ return generator.templatePath('base/' + name);},
				getModule : function(name){ return generator.templatePath('module/' + name)},
				getLicense : function(name) { return pathJoin(__dirname,'templates/licenses',name);}
			}
		}
	};
}

var method = Helper.prototype;

method.isInited = function(){
	return (
		this.getYoRc('inited')
		&& this.getYoRc('app')
		&& this.getYoRc('subgenerator')
	);
};

method.callSubGenerator = function (subGenName) {
	this.gen.composeWith(
		this.ENV.name.generator + ':' + subGenName, {}, {
			local: this.ENV.path.getSubgenerator(subGenName)
		}
	);
};

method.generateModule = function(moduleName,done){
	var destinationPath = this.ENV.path.getDestination();
	var basePath = this.ENV.path.temp.getModule(moduleName);

	this.generate(basePath, destinationPath,done);
};
method.generateBase = function(baseName,done){
	var destinationPath = this.ENV.path.getDestination();
	var setupBasePath = this.ENV.path.temp.getSetupBase();
	var basePath = this.ENV.path.temp.getBase(baseName);

	var finish = { setup: false, base: false};

    this.generate( setupBasePath, destinationPath, function(){
        if(finish.base == true) done();
        else finish.setup = true;
    });

	this.generate(basePath,destinationPath,function(){
		if(finish.setup == true) done();
		else finish.base = true;
	});
};
method.generate = function(fromPath,toPath,done){
	var self = this;

	var licensePath = this.ENV.path.temp.getLicense(this.getYoRc('app.license'));
	var setupEjsPath = this.ENV.path.temp.getSetupEjs();
	var setupEjsFilesPathsArr = utils.getAllFilesPaths(setupEjsPath);

	var yoRcConfig = this.getYoRc();
	var ejsTempConfig = this.getYoRc();
	ejsTempConfig.ejs = {};

	/**
	 * Filling ejsTempConfig object
	 */
	for (var i in setupEjsFilesPathsArr) {
		var setupEjsFilePath = setupEjsFilesPathsArr[i];
		var ejsKey = setupEjsFilePath.replace(setupEjsPath + '/', '').replace(/\//g, '_');
		try {
			ejsTempConfig.ejs[ejsKey] = ejs.render(
				this.gen.fs.read(setupEjsFilePath),
				yoRcConfig
			);
		} catch (err) {
			this.throwFileError(err.message,setupEjsFilePath);
		}
	}

	/**
	 * Add license to ejsTempConfig object
	 */
	try {
		ejsTempConfig.ejs.license = ejs.render(
			self.gen.fs.read(licensePath),
			yoRcConfig
		);
	} catch (err) {
		self.throwFileError(err.message,licensePath);
	}

	/**
	 * Generate and render structure with ejs rendered
	 */
	var walker = walk.walk(fromPath);
	walker.on("file", function (root, file, next) {
		var fromPath = pathJoin(root, file.name);
		try {
			var to = ejs.render(fromPath.replace(fromPath, toPath), yoRcConfig);
			utils.isEditable(fromPath,function(isEditable){
				if(isEditable)
					self.gen.fs.write(to, ejs.render(self.gen.fs.read(fromPath), ejsTempConfig));
				else
					self.gen.fs.copy(fromPath, to);
				next();
			});
		} catch (err){
			self.throwFileError(err.message,fromPath);
		}
	});

	walker.on('end', done);
};

method.runLineInjector = function(injectorName){
	var self = this;

	var inject = utils.yamlToJson(
        this.gen.templatePath('setup/injector/' + injectorName + '.yml')
    );

	for(var filePath in inject){
		var lineFlag = inject[filePath].flag;
		var injectArr = inject[filePath].text.split('\n');
		utils.injectLines(filePath,lineFlag,injectArr,function(newContent){
			self.gen.write(filePath,newContent);
		});
	}
};
method.callSubGeneratorMethod = function(subGeneratorMethod){
	if (subGeneratorMethod in this.gen)
		if(this.gen[subGeneratorMethod] instanceof Function){
			this.gen[subGeneratorMethod]();
		}
};

method.throwFileError = function(message, path){
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

	json.app.createdAt = utils.getNowDate();
	this.gen.config.set(json);

	yoRc[this.appName] = json;

	fs.writeFileSync(
		this.gen.destinationPath('.yo-rc.json'),
		JSON.stringify(yoRc, null, 4)
	);
};
method.getYoRc = function (keys){
	var keysArr = keys ? keys.split('.') : [];
    return utils.getJsonValue(
		keysArr,
        this.gen.config.getAll()
    );
};
method.setYoRc = function(keys, value){
	var newJson = utils.setJsonValue(
		keys.split('.'),
		value,
		this.gen.config.getAll()
	);

	this.gen.config.set(newJson);

};

method.getBasesNames = function(){
	return fs.readdirSync(this.gen.templatePath('base'));
};
method.getModulesNames = function(){
	return fs.readdirSync(this.gen.templatePath('module'));
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
