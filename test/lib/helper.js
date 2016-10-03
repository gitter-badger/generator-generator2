var assert = require('assert');
var path = require('path');
var fs = require('fs');
var sinon = require('sinon');
var yoEnv = require('yeoman-environment');
var yosay = require('yosay');

var license = require('../../lib/license');
var utils = require('../../lib/utils');
var Helper = require('../../lib/helper');
var generator = require('../data/helper/constructor/generator');

describe('Helper', function () {

	beforeEach(function () {
		this.generator = new yoEnv().instantiate(generator);
		this.helper = new Helper(this.generator);
	});

	describe('constructor', function () {
		it('sets #gen property', function () {
			assert.equal(this.helper.gen, this.generator);
		});
		it('sets #ENV', function () {
			assert(this.helper.ENV);
		});
		it('sets #logger', function () {
			assert(this.helper.logger);
		});
		it('throw error on bad app name', function (done) {
			var testGeneratorName = sinon.stub(utils, 'testGeneratorName');
			testGeneratorName.returns(false);
			try {
				new Helper(this.generator);
				done('Should not pass');
			} catch (err) {
				assert(/Helper app name failed to validate!/.test(err.message));
				assert(testGeneratorName.calledOnce);
				done();
			} finally {
				utils.testGeneratorName.restore();
			}
		});
	});

	describe('#_initEnv', function () {
		describe('#ENV.logger.file.formater', function () {
			beforeEach(function () {
				this.fileFormater = this.helper.ENV.logger.file.formatter;
			});
			it('formats without meta object', function () {
				var options = {
					message: 'Message',
					level: 'level',
					meta: {}
				};
				assert.equal(
					this.fileFormater(options),
					'LEVEL Message'
				);
			});
			it('formats with meta object', function () {
				var options = {
					message: 'Message',
					level: 'level',
					meta: {
						key0: 'value0',
						key1: {
							key2: 'value1',
							key3: {
								key4: 'value4'
							}
						}
					}
				};
				assert.equal(
					this.fileFormater(options),
					'LEVEL Message: ' + JSON.stringify(options.meta, null, '\t')
				);
			});
		});
		describe('#ENV.logger.console.formater', function () {
			beforeEach(function () {
				this.fileFormater = this.helper.ENV.logger.console.formatter;
			});
			it('returns joined meta stack', function () {
				var options = {
					meta: {stack: ['line0', 'line1']}
				};
				assert.equal(
					this.fileFormater(options),
					'line0\nline1'
				);
			});
		});
	});

	describe('#registerEvents', function () {
		it('register exit signal', function () {
			process.setMaxListeners(0);
			sinon.spy(process, 'on');
			this.helper.registerProcessEvents();
			assert(process.on.withArgs('exit').calledOnce);
			process.on.restore();
		});
		it('on exit event log exit code', function () {
			this.helper.registerProcessEvents();
			var level = 'info';
			sinon.spy(this.helper.logger, level);
			process.emit('exit');
			assert(this.helper.logger[level]
				.withArgs('Process exit:', process.exitCode)
				.calledOnce
			);
			this.helper.logger[level].restore();
		});
	});

	describe('#isGeneratorInited', function () {
		it('return false on init', function () {
			assert(!this.helper.isGeneratorInited());
		});
	});

	describe('#isSubgeneratorInited', function () {
		it('return false on init', function () {
			assert(!this.helper.isSubgeneratorInited());
		});
	});

	describe('#callSubgenerator', function () {
		it('should call composeWith', function () {
			sinon.stub(this.helper.gen, 'composeWith');

			this.helper.callSubgenerator('NAME');

			assert(this.helper.gen.composeWith.calledOnce);

			this.helper.gen.composeWith.restore();
		});
		it('should call logger', function () {
			sinon.stub(this.helper.gen, 'composeWith');
			sinon.stub(this.helper.logger, 'info');

			this.helper.callSubgenerator('NAME');

			assert(this.helper.logger.info.calledOnce);

			this.helper.logger.info.restore();
		});
	});

	describe('#getLicense', function () {
		it('calls licenser with good arguments', function () {
			sinon.stub(this.helper, 'getYoRc')
				.returns('licenseName');
			sinon.stub(license, 'getContent')
				.returns('licenseContent');

			this.helper.getLicense();

			assert(license.getContent.withArgs(
				'licenseName',
				sinon.match.number,
				sinon.match.string
			));

			this.helper.getYoRc.restore();
			license.getContent.restore();
		});
	});

	describe('#generateModule', function () {
		it('logs informations and call generate', function () {
			sinon.spy(this.helper.logger, 'info');
			sinon.stub(this.helper, 'generate');
			var done = sinon.stub();

			this.helper.generateModule('moduleName', done);

			assert(this.helper.logger.info
				.withArgs('Generate module:', 'moduleName')
				.calledOnce
			);
			assert(this.helper.generate
				.withArgs(
					sinon.match.string,
					sinon.match.string,
					done
				).calledOnce
			);

			this.helper.generate.restore();
			this.helper.logger.info.restore();
		});
	});

	describe('#generateBase', function () {
		it('logs informations and call generate on setupBase and base', function () {
			sinon.spy(this.helper.logger, 'info');
			sinon.stub(this.helper, 'generate');

			this.helper.generateBase('baseName', function () {
			});

			assert(this.helper.logger.info
				.withArgs('Generate base:', 'baseName')
				.calledOnce
			);
			assert(this.helper.generate
				.withArgs(
					sinon.match.string,
					sinon.match.string,
					sinon.match.func
				).calledTwice
			);

			this.helper.generate.restore();
			this.helper.logger.info.restore();
		});
	});

	describe('#generate', function () {
		beforeEach(function () {
			this.getLicense = sinon.stub(this.helper, 'getLicense');
			this.getSetupEjs = sinon.stub(this.helper.ENV.path.temp, 'getSetupEjs');
			this.getYoRc = sinon.stub(this.helper, 'getYoRc');
			this.fsWrite = sinon.stub(this.helper.gen.fs, 'write');
			this.fsCopy = sinon.stub(this.helper.gen.fs, 'copy');
			this.debug = sinon.stub(this.helper.logger, 'debug');

			this.fromDir = path.join(__dirname, '../data/helper/generate/fromDir');

			this.getSetupEjs.returns(path.join(__dirname, '../data/helper/generate/setupEjs'));
			this.getLicense.returns('licenseContent');
			this.getYoRc.returns({
				getYoRc_key0: 'getYoRc_value0',
				getYoRc_key1: 'getYoRc_value1'
			});
		});

		afterEach(function () {
			this.helper.getLicense.restore();
			this.getSetupEjs.restore();
			this.getYoRc.restore();
			this.fsWrite.restore();
			this.fsCopy.restore();
			this.debug.restore();
		});

		it('should write editable files and copy unditable and log', function (done) {
			var self = this;

			this.helper.generate(this.fromDir, 'toDir', function () {

				var error = 0;

				assert(self.debug.withArgs('Write:', 'toDir/file0').calledOnce, 'Err: ' + error++);
				assert(self.fsWrite.withArgs('toDir/file0', 'content0').calledOnce, 'Err: ' + error++);

				assert(self.debug.withArgs('Write:', 'toDir/file1').calledOnce, 'Err: ' + error++);
				assert(self.fsWrite.withArgs('toDir/file1', 'content1').calledOnce, 'Err: ' + error++);

				assert(self.debug.withArgs('Write:', 'toDir/dir0/file0').calledOnce, 'Err: ' + error++);
				assert(self.fsWrite.withArgs('toDir/dir0/file0', 'dir0.content0').calledOnce, 'Err: ' + error++);

				assert(self.debug.withArgs('Write:', 'toDir/getYoRc_value0/getYoRc_value1').calledOnce, 'Err: ' + error++);
				assert(self.fsWrite.withArgs('toDir/getYoRc_value0/getYoRc_value1', 'value0').calledOnce, 'Err: ' + error++);

				assert(self.debug.withArgs('Copy:', 'toDir/getYoRc_value0/mp3.py').calledOnce, 'Err: ' + error++);
				assert(self.fsCopy.withArgs(
					path.join(self.fromDir, '<%-getYoRc_key0%>/mp3.py'),
					'toDir/getYoRc_value0/mp3.py').calledOnce, 'Err: ' + error++);

				done();
			});
		});

	});

	describe('#runLineInjector', function () {
		beforeEach(function () {
			this.injectLines = sinon.stub(utils, 'injectLines');
			this.getSetupInjector = sinon.stub(this.helper.ENV.path.temp, 'getSetupInjector');
			this.fsWrite = sinon.stub(this.helper.gen.fs, 'write');
			this.info = sinon.stub(this.helper.logger, 'info');
			this.debug = sinon.stub(this.helper.logger, 'debug');

			this.getSetupInjector.returns(
				path.join(__dirname, '../data/helper/runLineInjector/injector')
			);

			this.injectLines.returns(
				'injectLines'
			);

		});
		afterEach(function () {
			this.injectLines.restore();
			this.getSetupInjector.restore();
			this.fsWrite.restore();
			this.info.restore();
			this.debug.restore();
		});

		it('should log and write', function () {
			var self = this;

			this.helper.runLineInjector('injectorName');

			var error = 0;

			assert(self.fsWrite.withArgs(sinon.match.string, 'injectLines').calledOnce, 'Err: ' + error++);
			assert(self.info.withArgs('Run line injector:', 'injectorName').calledOnce, 'Err: ' + error++);
			assert(self.debug.withArgs('Inject:', {
				filePath: sinon.match.string,
				lineFlag: 'flag',
				injectArr: ['line0', 'line1']
			}).calledOnce, 'Err: ' + error++);
		});
	});

	describe('#callSubgeneratorMethod', function () {

		beforeEach(function () {
			this.helper.gen.methodName = function () {
			};

			this.methodName = sinon.stub(this.helper.gen, 'methodName');
			this.info = sinon.stub(this.helper.logger, 'info');
		});

		afterEach(function () {
			this.methodName.restore();
			this.info.restore();
		});

		it('call method if exist and log', function () {
			this.helper.callSubgeneratorMethod('methodName');

			assert(this.methodName.calledOnce);
			assert(this.info.withArgs('Call subgenerator method:', 'methodName').calledOnce);
		});

		it('call method and log if dont exist', function () {
			this.helper.callSubgeneratorMethod('NOT_EXIST');

			assert(!this.methodName.calledOnce);
			assert(!this.info.calledOnce);
		});
	});

	describe('#postPrompt', function () {
		beforeEach(function () {
			var self = this;

			this.prompt = sinon.stub(this.helper.gen, 'prompt');
			this.info = sinon.spy(this.helper.logger, 'info');
			this.getBasesNames = sinon.stub(this.helper, 'getBasesNames');
			this.getModulesNames = sinon.stub(this.helper, 'getModulesNames');
			this.isSubgeneratorInited = sinon.stub(this.helper, 'isSubgeneratorInited');

			this.tmpNameAnsweres = {
				_name: 'tmpName'
			};

			this.answeres = {
				key0: 'value0'
			};

			this.cbAnsweres = {
				base: {
					name: 'tmpName',
					key0: 'value0'
				}
			};

			this.questions = {
				'base': {
					'tmpName': 'value0'
				}
			};

			this.prompt.withArgs(this.questions.base.tmpName).returns({
				then: function (cb) {
					cb(self.answeres);
				}
			});

			this.prompt.withArgs(sinon.match.array).returns({
				then: function (cb) {
					cb(self.tmpNameAnsweres);
				}
			});

			this.isSubgeneratorInited.returns(false);

		});

		afterEach(function () {
			this.prompt.restore();
			this.info.restore();
			this.getModulesNames.restore();
			this.getBasesNames.restore();
			this.isSubgeneratorInited.restore();
		});

		it('should call callback with answeres', function (done) {
			var self = this;

			this.helper.postPrompt(this.questions, function (answeres) {
				var error = 0;
				assert(self.getModulesNames.calledOnce, 'Err: ' + error++);
				assert(self.getBasesNames.calledOnce, 'Err: ' + error++);
				assert(self.info.withArgs('Post prompt answeres', self.cbAnsweres), 'Err: ' + error++);
				assert.deepEqual(answeres, self.cbAnsweres, 'Err: ' + error++);
				done();
			});

		});
	});

	describe('#initPrompt', function () {
		beforeEach(function () {
			var self = this;

			this.prompt = sinon.stub(this.helper.gen, 'prompt');
			this.info = sinon.spy(this.helper.logger, 'info');

			this.appAnsweres = {key2: 'value2'};
			this.generatorAnsweres = {'_key0': 'value0', '_key1': 'value1'};
			this.questions = 'appQuestions';

			this.cbAnsweres = {
				app: {
					key0: 'value0',
					key1: 'value1',
					key2: 'value2'
				}
			};

			this.prompt
				.withArgs(this.questions)
				.returns({
					then: function (cb) {
						cb(self.appAnsweres);
					}
				});

			this.prompt
				.withArgs(sinon.match.array)
				.returns({
					then: function (cb) {
						cb(self.generatorAnsweres);
					}
				});
		});

		afterEach(function () {
			this.prompt.restore();
			this.info.restore();
		});

		it('should call callback with answeres', function (done) {
			var self = this;

			this.helper.initPrompt(self.questions, function (answeres) {
				var error = 0;
				assert(self.info.withArgs('Init prompt answeres', self.cbAnsweres), 'Err: ' + error++);
				assert.deepEqual(answeres, self.cbAnsweres, 'Err: ' + error++);
				done();
			});

		});
	});

	describe('#createYoRc', function () {
		beforeEach(function () {
			this.getNowDate = sinon.stub(utils, 'getNowDate').returns('1234');
			this.setYoRc = sinon.spy(this.helper, 'setYoRc');
			this.info = sinon.spy(this.helper.logger, 'info');
			this.fsWriteFileSync = sinon.stub(fs, 'writeFileSync');
			this.getDestination = sinon.stub(this.helper.ENV.path, 'getDestination')
				.withArgs('.yo-rc.json').returns('yoRcDestination');

			this.args = {
				app: {
					key: 'jsonYoRc',
					createdAt: '1234'
				}
			};
		});
		afterEach(function () {
			this.getNowDate.restore();
			this.setYoRc.restore();
			this.info.restore();
			this.fsWriteFileSync.restore();
			this.helper.ENV.path.getDestination.restore();
		});

		it('calls setYoRc', function () {
			this.helper.createYoRc(this.args);
			assert(this.setYoRc.withArgs(this.args).calledOnce);
		});

		it('logs execution', function () {
			this.helper.createYoRc(this.args);
			assert(this.info.withArgs('Create .yo-rc.json', {'generator-generator2': this.args}).calledOnce);
		});

		it('writes file to destination', function () {
			this.helper.createYoRc(this.args);
			assert(this.fsWriteFileSync
				.withArgs('yoRcDestination', JSON.stringify({'generator-generator2': this.args}, null, 4))
				.calledOnce
			);
		});
	});

	describe('#getYoRc', function () {
		beforeEach(function () {
			this.return = {key: 'value'};
			this.getAll = sinon.stub(this.helper.gen.config, 'getAll')
				.returns(this.return);
		});
		afterEach(function () {
			this.getAll.restore();
		});

		it('returns all config', function () {
			assert.deepEqual(this.helper.getYoRc(), this.return);
		});
		it('returns value', function () {
			assert.deepEqual(this.helper.getYoRc('key'), this.return.key);
		});
	});

	describe('#setYoRc', function () {
		beforeEach(function () {
			this.config = {key: 'value'};
			this.set = sinon.stub(this.helper.gen.config, 'set');
			this.getYoRc = sinon.stub(this.helper, 'getYoRc').returns(this.config);
			this.info = sinon.stub(this.helper.logger, 'info');
		});
		afterEach(function () {
			this.set.restore();
			this.getYoRc.restore();
			this.info.restore();
		});

		it('sets config value for key', function () {
			this.helper.setYoRc('value1', 'key');
			assert(this.set.withArgs({key: 'value1'}).calledOnce);
		});
		it('sets all config json', function () {
			this.helper.setYoRc({key1: 'value2'});
			assert(this.set.withArgs({key1: 'value2'}).calledOnce);
		});
		it('logs informations', function () {
			this.helper.setYoRc('value1', 'key1');
			var error = 0;
			assert(this.info.withArgs('Set yoRc config', {
				value: 'value1',
				keys: 'key1'
			}).calledOnce, 'Err: ' + error++);
			assert(this.info.withArgs('New yoRc config', sinon.match.object).calledOnce, 'Err: ' + error++);
			assert(this.getYoRc.withArgs().calledTwice, 'Err: ' + error++);
		});
	});

	describe('#getBasesNames', function () {
		beforeEach(function () {
			this.getBase = sinon.stub(this.helper.ENV.path.temp, 'getBase')
				.returns(path.join(__dirname, '../data/helper/getBasesNames'));
		});
		afterEach(function () {
			this.getBase.restore();
		});

		it('returns bases names', function () {
			assert.deepEqual(this.helper.getBasesNames(), [
				'base0', 'base1'
			]);
		});
	});

	describe('#getModulesNames', function () {
		beforeEach(function () {
			this.getModule = sinon.stub(this.helper.ENV.path.temp, 'getModule')
				.returns(path.join(__dirname, '../data/helper/getModulesNames'));
		});
		afterEach(function () {
			this.getModule.restore();
		});

		it('returns modules names', function () {
			assert.deepEqual(this.helper.getModulesNames(), [
				'module0', 'module1'
			]);
		});
	});

	describe('#sayWelcome', function () {
		beforeEach(function () {
			this.log = sinon.stub(this.helper.gen, 'log');
		});
		afterEach(function () {
			this.log.restore();
		});

		it('logs yosay string', function () {
			this.helper.sayWelcome();
			assert(this.log.withArgs(sinon.match.string).calledOnce);
		});
	});

	describe('#sayWelcomeBack', function () {
		beforeEach(function () {
			this.log = sinon.stub(this.helper.gen, 'log');
		});
		afterEach(function () {
			this.log.restore();
		});

		it('logs yosay string', function () {
			this.helper.sayWelcomeBack();
			assert(this.log.withArgs(sinon.match.string).calledOnce);
		});
	});

	describe('#sayGoodBye', function () {
		beforeEach(function () {
			this.log = sinon.stub(this.helper.gen, 'log');
		});
		afterEach(function () {
			this.log.restore();
		});

		it('logs yosay string', function () {
			this.helper.sayGoodBye();
			assert(this.log.withArgs(sinon.match.string).calledOnce);
		});
	});
});
