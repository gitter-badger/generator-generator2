'use strict';

var fs = require('fs');
var yosay = require('yosay');
var walk = require('walk');
var os = require('os');
var ejs = require('ejs');
var process = require('process');
var pathJoin = require('path').join;
var licenser = require('licenser');
var winston = require('winston');
var utils = require('./utils');
var genName;

/**
 * Helper module for generator and subgenerator.
 * Module that hold all hard logic.
 * @module helper
 */

/**
 * Constructor. Wraps generator instance generated with
 * `require('generator-generator').Base.extend({})`.
 *
 * @constructor
 * @param generator {generator-generator.Base} Generator/subgenerator instance.
 *
 * @class Helper class which holds most hard logic,
 * so that generators/subgenerators methods can be
 * as clean as possible.
 *
 * @type {module.Helper}
 */
var Helper = module.exports = function Helper(generator) {

	/**
	 * Holds generator instance.
	 * @member
	 */
	this.gen = generator;

	/**
	 * Holds class configuration.
	 * @member
	 */
	this.ENV;

	/**
	 * Main class logger.
	 * @member
	 */
	this.logger;

	this._initEnv();
	this._initLogger();
};

/**
 * Setup ENV property.
 * @private
 */
Helper.prototype._initEnv = function(){
	var self = this;

	var genName = this.gen.rootGeneratorName();

	if(!utils.testGeneratorName(genName)){
		throw new Error([
			'Helper app name failed to validate!',
			' > (generator-NAME) != ' + genName
		].join('\n'))
	}

	this.ENV = {
		version : self.gen.rootGeneratorVersion(),
		name: {
			app: genName,
			generator: genName.split('-')[1]
		},
		path: {
			getSubgenerator: function (name) { return pathJoin(self.gen.templatePath(), '../..', name) },
			getDestination: function (file) { return self.gen.destinationPath(file || '.') },
			temp: {
				getSetupBase: function () { return self.gen.templatePath('setup/base'); },
				getSetupEjs: function () { return self.gen.templatePath('setup/ejs'); },
				getBase: function (name) { return self.gen.templatePath('base/' + (name || '.')); },
				getModule: function (name) { return self.gen.templatePath('module/' + (name || '.')) },
				getSetupInjector: function (name) { return self.gen.templatePath('setup/injector/' + name + '.yml'); }
			}
		},
		logger : {
			file : {
				handleExceptions: true,
				humanReadableUnhandledException: true,
				level: 'silly',
				silent: this.gen.options.debug ? false : true,
				colorize: false,
				timestamp: false,
				filename: this.gen.destinationPath('generator.debug'),
				formatter: function (options) {
					var level = options.level.toUpperCase();
					var message = options.message ? options.message : '';
					var meta;

					if (Object.keys(options.meta).length != 0) {
						meta = ': ' + JSON.stringify(options.meta, null, '\t');
					} else meta = '';

					return level + ' ' + message + meta;
				},
				json: false,
				eol: '\n',
				prettyPrint: true,
				showLevel: true,
				options: {flags: 'w'}
			},
			console : {
				handleExceptions: true,
				humanReadableUnhandledException: true,
				prettyPrint: true,
				silent: false,
				json: false,
				stringify: true,
				colorize: true,
				level: 'exception',
				showLevel: false,
				formatter: function (options) {
                    return options.meta.stack.join('\n');
				}
			}
		}
	};
};

/**
 * Setup logger with winston logger instance.
 * @private
 */
Helper.prototype._initLogger = function(){

	this.logger = new winston.Logger({
		transports: [
			new (winston.transports.File)(this.ENV.logger.file),
			new (winston.transports.Console)(this.ENV.logger.console)
		],
		exitOnError: false
	});

	this.logger.info('System info',{
		node : process.version,
		argv : process.argv,
		os : {
			patform : os.platform(),
			release : os.release(),
			type : os.type()
		}
	});
	this.logger.info('Generator info',{
		version : this.ENV.version,
		yoRc : this.getYoRc()
	});
};

/**
 * Register and catch process events.
 */
Helper.prototype.registerProcessEvents = function (){
	var self = this;

	process.on('exit', function (code) {
		self.logger.info('Process exit:', code);
	});
};

/**
 * Check if generator is inited in `yo-rc.json`.
 * @returns {boolean}
 */
Helper.prototype.isGeneratorInited = function () {
	return (
		this.getYoRc() &&
		this.getYoRc('app')
	) ? true : false;
};

/**
 * Check if subgenerator is inited in `yo-rc.json`.
 * @returns {boolean}
 */
Helper.prototype.isSubgeneratorInited = function () {
	return (
		this.isGeneratorInited() &&
		this.getYoRc('subgenerator') &&
		this.getYoRc('inited')
	) ? true : false;
};

/**
 * Run local subgenerator run context.
 * @param subgeneratorName {string} Subgenerator name.
 */
Helper.prototype.callSubgenerator = function (subgeneratorName) {

	this.logger.info('Call subgenerator:',{
		name : this.ENV.name.generator + ':' + subgeneratorName,
		local: this.ENV.path.getSubgenerator(subgeneratorName)
	});

	this.gen.composeWith(
		this.ENV.name.generator + ':' + subgeneratorName, {}, {
			local: this.ENV.path.getSubgenerator(subgeneratorName)
		}
	);
};

/**
 * Generate license content base on `yo-rc.json` property `app.license'.
 * @returns {string} Generated license content.
 */
Helper.prototype.getLicense = function () {
	var licenseName = this.getYoRc('app.license');

	return licenser.getLicense(
		licenseName,
		new Date().getFullYear(),
		this.getYoRc('app.authorName')
	);
};

/**
 * Generate module structure base on subgenerator template.
 * @param moduleName {string} Module name.
 * @param done {function} Execute on done.
 */
Helper.prototype.generateModule = function (moduleName, done) {
	this.logger.info('Generate module:',moduleName);

	var destinationPath = this.ENV.path.getDestination();
	var basePath = this.ENV.path.temp.getModule(moduleName);

	this.generate(basePath, destinationPath, done);
};

/**
 * Generate base structure base on subgenerator template.
 * @param baseName {string} Base name.
 * @param done {function} Execute on done.
 */
Helper.prototype.generateBase = function (baseName, done) {
	this.logger.info('Generate base:',baseName);

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

/**
 * Main generate method which generate ejs configuration from
 * `yo-rc.json` file and subgenerator templates.
 * @param fromDir {string} Absolute path of source code.
 * @param toDir {string} Absolute path of destination.
 * @param done {function} Execute on done.
 */
Helper.prototype.generate = function (fromDir, toDir, done) {
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
        ejsTempConfig.ejs[ejsKey] = utils.ejsRender(
            setupEjsFilePath,
            yoRcConfig
        );
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
        var renderedToPath = ejs.render(filePath.replace(fromDir, toDir), yoRcConfig);
        utils.isEditable(filePath, function (err,isEditable) {
			if(err) throw err;
            if (isEditable) {
                self.logger.debug('Write:',renderedToPath);
                self.gen.fs.write(renderedToPath, utils.ejsRender(filePath, ejsTempConfig));
            } else {
                self.logger.debug('Copy:',renderedToPath);
                self.gen.fs.copy(filePath, renderedToPath);
            }
            next();
        });
	});

	walker.on('end', done);
};

/**
 * It will inject lines in files base on template injector setup.
 * @param injectorName {string} Injector name.
 */
Helper.prototype.runLineInjector = function (injectorName) {
	this.logger.info('Run line injector:',injectorName);

	var inject = utils.yamlToJson(
		this.ENV.path.temp.getSetupInjector(injectorName)
	);

	for (var filePath in inject) {
		var destFilePath = this.ENV.path.getDestination(filePath);
		var lineFlag = inject[filePath].flag;
		var injectArr = inject[filePath].text.split('\n');
		this.logger.debug('Inject:',{
			filePath:destFilePath,
			lineFlag:lineFlag,
			injectArr: injectArr
		});
		this.gen.fs.write(
			destFilePath,
			utils.injectLines(destFilePath, lineFlag, injectArr)
		);
	}
};

/**
 * It will call subgenerator method with user specific code.
 * @param methodName {string} Subgenerator method name.
 */
Helper.prototype.callSubgeneratorMethod = function (methodName) {
	if (methodName in this.gen)
		if (this.gen[methodName] instanceof Function) {
			this.logger.info('Call subgenerator method:',methodName);
			this.gen[methodName]();
		}
};

/**
 * Ask user questions base on provided questions array.
 * @param questions {array} Array of questions.
 * @param callback {function} Will execute when all the questions will be answered.
 * Callback will execute with answered object.
 */
Helper.prototype.initPrompt = function (questions, callback) {
	var self = this;

	return this.gen.prompt(questions.app).then(function (appAnswers) {
		var appSubgenerator = appAnswers.subgenerator;
		return self.gen.prompt(questions[appSubgenerator]).then(function (subgeneratorAnswers) {

			var answeres = {app: appAnswers};
			answeres[appSubgenerator] = subgeneratorAnswers;

			self.logger.info('Init prompt answeres',answeres);
			callback(answeres);

		}.bind(self.gen));
	}.bind(this.gen));

};

/**
 * Ask user questions specific to base or module.
 * @param questions {array} Array of questions.
 * @param callback {function} Execute with answered object.
 */
Helper.prototype.postPrompt = function (callback) {
	var self = this;

	var questions = {
        "base": [
            {
                "type": "list",
                "name": "base",
                "message": "Select project base:",
                "choices": self.getBasesNames()
            }
        ],
        "module": [
            {
                "type": "list",
                "name": "module",
                "message": "Select project module:",
                "choices": self.getModulesNames()
            }
        ]
    }[this.isSubgeneratorInited() ? 'module' : 'base'];

	return this.gen.prompt(questions).then(function (answeres) {
		self.logger.info('Post prompt answeres',answeres);
		callback(answeres);
	}.bind(this.gen));
};

/**
 * It will create `yo-rc.json` file to destination.
 * @param json {object} `yo-rc.json` content.
 */
Helper.prototype.createYoRc = function (json) {
	var yoRc = {};

	json.app.createdAt = utils.getNowDate();
	this.setYoRc(json);

	yoRc[this.ENV.name.app] = json;

	this.logger.info('Create .yo-rc.json',yoRc);

	fs.writeFileSync(
		this.ENV.path.getDestination('.yo-rc.json'),
		JSON.stringify(yoRc, null, 4)
	);
};

/**
 * Get `yo-rc.json` content.
 * @param keys {string} If keys is `null` method will return
 * whole `yo-rc.json` content. If keys type will be string like `key.anotherKey`, it
 * will return key value or undefined.
 * @returns {object | string | undefined}
 */
Helper.prototype.getYoRc = function (keys) {
	var keysArr = keys ? keys.split('.') : [];
	return utils.getJsonValue(
		keysArr,
		this.gen.config.getAll()
	);
};

/**
 * Set `yo-rc.json` content.
 * @param value {*} Value of key provided in parameters.
 * @param keys {string} Example `key.anotherKey`, it will create json if sub key
 * don't exist and set child key to value provided in parameters.
 */
Helper.prototype.setYoRc = function (value, keys) {
	this.logger.info('Set yoRc config',{
		value: value,
		keys: keys
	});

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

	this.logger.info('New yoRc config',this.getYoRc());

};

/**
 * Get template base names.
 * @returns {array<string>} Array of base names base on template folder.
 */
Helper.prototype.getBasesNames = function () {
	return fs.readdirSync(
		this.ENV.path.temp.getBase()
	);
};

/**
 * Get template module names.
 * @returns {array<string>} Array of module names base on template folder.
 */
Helper.prototype.getModulesNames = function () {
	return fs.readdirSync(
		this.ENV.path.temp.getModule()
	);
};

/**
 * Print welcome message.
 */
Helper.prototype.sayWelcome = function () {
	this.gen.log(yosay([
		"♥ Java ♥",
		"♥ TypeScript ♥",
		"♥ Node ♥",
		"♥ Python ♥"
	].join('\n')));
};

/**
 * Print welcome back message.
 */
Helper.prototype.sayWelcomeBack = function () {
	this.gen.log(yosay([
		this.getYoRc('app.authorName'),
		"♥",
		this.getYoRc('app.name')
	].join(' ')));
};

/**
 * Print good bye message.
 */
Helper.prototype.sayGoodBye = function () {
	this.gen.log([
		'',
		' ♥ Yeoman loves you! ♥'
	].join('\n'));
};
