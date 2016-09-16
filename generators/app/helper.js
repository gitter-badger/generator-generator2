'use strict';

var fs = require('fs');
var yosay = require('yosay');
var walk = require('walk');
var os = require('os');
var process = require('process');
var pathJoin = require('path').join;
var licenser = require('licenser');
var winston = require('winston');
var utils = require('./utils');
var pac = require('../../package.json');

function Helper(generator) {
	this.gen = generator;

	utils.validateGeneratorName(pac.name);

	this.ENV;
	this.logger;

	this.initEnv();
	this.initLogger();
}

var method = Helper.prototype;

method.initEnv = function(){
	var self = this;
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
				return self.gen.destinationPath(file || '.')
			},
			temp: {
				getSetupBase: function () {
					return self.gen.templatePath('setup/base');
				},
				getSetupEjs: function () {
					return self.gen.templatePath('setup/ejs');
				},
				getBase: function (name) {
					return self.gen.templatePath('base/' + (name || '.'));
				},
				getModule: function (name) {
					return self.gen.templatePath('module/' + (name || '.'))
				},
				getSetupInjector: function (name) {
					return self.gen.templatePath('setup/injector/' + name + '.yml');
				}
			}
		}
	};
};
method.initLogger = function(){
	this.logger = new winston.Logger({
		transports: [
			new (winston.transports.File)({
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
			}),
			new (winston.transports.Console)({
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
			})
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
		version : pac.version,
		yoRc : this.getYoRc()
	});
};

method.registerEvents = function(){
	var self = this;

    process.on('exit', function(code){
		self.logger.info('Process exit:',code);
    });

};

method.isGeneratorInited = function () {
	return (
		this.getYoRc() &&
		this.getYoRc('app')
	) ? true : false;
};
method.isSubgeneratorInited = function () {
	return (
		this.isGeneratorInited() &&
		this.getYoRc('subgenerator') &&
		this.getYoRc('inited')
	) ? true : false;
};

method.callSubgenerator = function (subgeneratorName) {
	this.logger.info('Call subgenerator:',subgeneratorName);

	this.gen.composeWith(
		this.ENV.name.generator + ':' + subgeneratorName, {}, {
			local: this.ENV.path.getSubgenerator(subgeneratorName)
		}
	);
};

method.getLicense = function () {
	var licenseName = this.getYoRc('app.license');

	return licenser.getLicense(
		licenseName,
		new Date().getFullYear(),
		this.getYoRc('app.authorName')
	);
};

method.generateModule = function (moduleName, done) {
	this.logger.info('Generate module:',moduleName);

	var destinationPath = this.ENV.path.getDestination();
	var basePath = this.ENV.path.temp.getModule(moduleName);

	this.generate(basePath, destinationPath, done);
};
method.generateBase = function (baseName, done) {
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
        var renderedToPath = utils.ejsRenderPath(filePath.replace(fromDir, toDir), yoRcConfig);
        utils.isEditable(filePath, function (isEditable) {
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

method.runLineInjector = function (injectorName) {
	this.logger.info('Run line injector:',injectorName);

	var self = this;

	var inject = utils.yamlToJson(
		this.ENV.path.temp.getSetupInjector(injectorName)
	);

	for (var filePath in inject) {
		var lineFlag = inject[filePath].flag;
		var injectArr = inject[filePath].text.split('\n');
		this.logger.debug('Inject:',{
			filePath:filePath,
			lineFlag:lineFlag,
			injectArr: injectArr
		});
		utils.injectLines(filePath, lineFlag, injectArr, function (newContent) {
			self.gen.fs.write(filePath, newContent);
		});
	}
};
method.callSubgeneratorMethod = function (methodName) {
	if (methodName in this.gen)
		if (this.gen[methodName] instanceof Function) {
			this.logger.info('Call subgenerator method:',methodName);
			this.gen[methodName]();
		}
};

method.initPrompt = function (questions, callback) {
	var self = this;

	return this.gen.prompt(questions.app).then(function (appAnswers) {
		var appLang = appAnswers.language;
		return self.gen.prompt(questions[appLang]).then(function (langAnswers) {

			var answeres = {app: appAnswers};
			answeres[appLang] = langAnswers;

			self.logger.info('Init prompt answeres',answeres);
			callback(answeres);

		}.bind(self.gen));
	}.bind(this.gen));

};
method.postPrompt = function (questions, callback) {
	var self = this;

	return this.gen.prompt(questions).then(function (answeres) {
		self.logger.info('Post prompt answeres',answeres);
		callback(answeres);
	}.bind(this.gen));
};

method.createYoRc = function (json) {
	var yoRc = {};

	json.app.createdAt = utils.getNowDate();
	this.setYoRc(json);

	yoRc[this.appName] = json;

	this.logger.info('Create .yo-rc.json',yoRc);

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

