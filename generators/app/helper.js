'use strict';

var fs = require('fs');
var yosay = require('yosay');
var walk = require('walk');
var chalk = require('chalk');
var ejs = require('ejs');
var pathJoin = require('path').join;
var licenser = require('licenser');

var utils = require('./utils');
var pac = require('../../package.json');

function Helper(generator) {
	this.gen = generator;

	utils.validateGeneratorName(pac.name);

	this.ENV = {
		name: {
			app: pac.name,
			generator: pac.name.split('-')[1]
		},
		path: {
			getSubgenerator: function (name) {
				return pathJoin(__dirname, '..', name)
			},
			getDestination: function (file) {
				return generator.destinationPath(file || '.')
			},
			temp: {
				getSetupBase: function () {
					return generator.templatePath('setup/base');
				},
				getSetupEjs: function () {
					return generator.templatePath('setup/ejs');
				},
				getBase: function (name) {
					return generator.templatePath('base/' + (name || '.'));
				},
				getModule: function (name) {
					return generator.templatePath('module/' + (name || '.'))
				},
				getSetupInjector: function (name) {
					return generator.templatePath('setup/injector/' + name + '.yml');
				}
			}
		}
	};
}

var method = Helper.prototype;

method.isGeneratorInited = function () {
	return (
		this.getYoRc() &&
		this.getYoRc('app')
	);
};
method.isSubgeneratorInited = function () {
	return (
		this.isGeneratorInited() &&
		this.getYoRc('subgenerator') &&
		this.getYoRc('inited')
	);
};

method.callSubgenerator = function (subgeneratorName) {
	this.gen.composeWith(
		this.ENV.name.generator + ':' + subgeneratorName, {}, {
			local: this.ENV.path.getSubgenerator(subgeneratorName)
		}
	);
};

method.getLicense = function () {
	return licenser.getLicense(
		this.getYoRc('app.license'),
		new Date().getFullYear(),
		this.getYoRc('app.authorName')
	);
};

method.generateModule = function (moduleName, done) {
	var destinationPath = this.ENV.path.getDestination();
	var basePath = this.ENV.path.temp.getModule(moduleName);

	this.generate(basePath, destinationPath, done);
};
method.generateBase = function (baseName, done) {
	var destinationPath = this.ENV.path.getDestination();
	var setupBasePath = this.ENV.path.temp.getSetupBase();
	var basePath = this.ENV.path.temp.getBase(baseName);

	var finish = {setup: false, base: false};

	this.generate(setupBasePath, destinationPath, function () {
		if (finish.base == true) done();
		else finish.setup = true;
	});

	this.generate(basePath, destinationPath, function () {
		if (finish.setup == true) done();
		else finish.base = true;
	});
};
method.generate = function (fromDir, toDir, done) {
	var self = this;

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
			this.throwFileError(err.message, setupEjsFilePath);
		}
	}

	/**
	 * Set license to ejsTempConfig object
	 */
	ejsTempConfig.ejs.license = this.getLicense();

	/**
	 * Generate and render structure with ejs rendered
	 */
	var walker = walk.walk(fromDir);
	walker.on("file", function (root, file, next) {
		var filePath = pathJoin(root, file.name);
		try {
			var renderedToPath = ejs.render(filePath.replace(fromDir, toDir), yoRcConfig);
			utils.isEditable(filePath, function (isEditable) {
				if (isEditable)
					self.gen.fs.write(renderedToPath, ejs.render(self.gen.fs.read(filePath), ejsTempConfig));
				else
					self.gen.fs.copy(filePath, renderedToPath);
				next();
			});
		} catch (err) {
			self.throwFileError(err.message, filePath);
		}
	});

	walker.on('end', done);
};

method.runLineInjector = function (injectorName) {
	var self = this;

	var inject = utils.yamlToJson(
		this.ENV.path.temp.getSetupInjector(injectorName)
	);

	for (var filePath in inject) {
		var lineFlag = inject[filePath].flag;
		var injectArr = inject[filePath].text.split('\n');
		utils.injectLines(filePath, lineFlag, injectArr, function (newContent) {
			self.gen.fs.write(filePath, newContent);
		});
	}
};
method.callSubgeneratorMethod = function (methodName) {
	if (methodName in this.gen)
		if (this.gen[methodName] instanceof Function) {
			this.gen[methodName]();
		}
};

method.throwFileError = function (message, path) {
	throw new Error(chalk.red.bold(
		"\n > Message: " + message + '\n' +
		" > File: " + path + '\n'
	));
};

method.initPrompt = function (questions, callback) {

	var self = this;

	return this.gen.prompt(questions.app).then(function (appAnswers) {
		var appLang = appAnswers.language;
		return self.gen.prompt(questions[appLang]).then(function (langAnswers) {

			var answeres = {app: appAnswers};
			answeres[appLang] = langAnswers;

			callback(answeres);

		}.bind(self.gen));
	}.bind(this.gen));

};
method.postPrompt = function (questions, callback) {
	return this.gen.prompt(questions).then(function (answeres) {
		callback(answeres);
	}.bind(this.gen));
};

method.createYoRc = function (json) {
	var yoRc = {};

	json.app.createdAt = utils.getNowDate();
	this.setYoRc(json);

	yoRc[this.appName] = json;

	fs.writeFileSync(
		this.ENV.path.getDestination('.yo-rc.json'),
		JSON.stringify(yoRc, null, 4)
	);
};
method.getYoRc = function (keys) {
	var keysArr = keys ? keys.split('.') : [];
	return utils.getJsonValue(
		keysArr,
		this.gen.config.getAll()
	);
};
method.setYoRc = function (value, keys) {
	if (keys)
		this.gen.config.set(
			utils.setJsonValue(
				keys.split('.'),
				value,
				this.getYoRc()
			)
		);
	else
		this.gen.config.set(value);

};

method.getBasesNames = function () {
	return fs.readdirSync(
		this.ENV.path.temp.getBase()
	);
};
method.getModulesNames = function () {
	return fs.readdirSync(
		this.ENV.path.temp.getModule()
	);
};

method.sayWelcome = function () {
	this.gen.log(yosay([
		"♥ Java ♥",
		"♥ TypeScript ♥",
		"♥ Node ♥",
		"♥ Python ♥"
	].join('\n')));
};
method.sayWelcomeBack = function () {
	this.gen.log(yosay([
		this.getYoRc('app.authorName'),
		"♥",
		this.getYoRc('app.name')
	].join(' ')));
};
method.sayGoodBye = function () {
	this.gen.log([
		'',
		' ♥ Yeoman loves you! ♥'
	].join('\n'));
};

module.exports = Helper;
