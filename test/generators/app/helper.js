var assert = require('assert');
var path = require('path');
var fs = require('fs');
var sinon = require('sinon');
var yoEnv = require('yeoman-environment');
var process = require('process');
var licenser = require('licenser');

var utils = require('../../../generators/app/utils');
var generator = require('../../data/helper/constructor/generator');
var Helper = require('../../../generators/app/helper');

describe('Helper', function () {

	beforeEach(function(){
		this.generator = new yoEnv().instantiate(generator);
		this.helper = new Helper(this.generator);
	});

	describe('constructor',function(){
		it('sets #gen property',function(){
			assert.equal(this.helper.gen,this.generator);
		});
		it('sets #ENV',function(){
			assert(this.helper.ENV);
		});
		it('sets #logger',function(){
			assert(this.helper.logger);
		});
		it('throw error on bad app name',function(done){
			var testGeneratorName = sinon.stub(utils,'testGeneratorName');
			testGeneratorName.returns(false);
			try{
				new Helper(this.generator);
				done('Should not pass');
			} catch (err){
				assert(/Helper app name failed to validate!/.test(err.message));
				assert(testGeneratorName.calledOnce);
				done();
			} finally {
				utils.testGeneratorName.restore();
			}
		});
	});

	describe('#registerEvents',function(){
		it('register exit signal',function(){
			process.setMaxListeners(0);
			sinon.spy(process,'on');
			this.helper.registerProcessEvents();
			assert(process.on.withArgs('exit').calledOnce);
			process.on.restore();
		});
		it('on exit event log exit code',function(){
			this.helper.registerProcessEvents();
			var level = 'info';
			sinon.spy(this.helper.logger,level);
			process.emit('exit');
			assert(this.helper.logger[level]
				.withArgs('Process exit:',process.exitCode)
				.calledOnce
			);
			this.helper.logger[level].restore();
		});
	});

	describe('#isGeneratorInited',function(){
		it('return false on init',function(){
			assert(!this.helper.isGeneratorInited());
		});
	});

	describe('#isSubgeneratorInited',function(){
		it('return false on init',function(){
			assert(!this.helper.isSubgeneratorInited());
		});
	});

	describe('#callSubgenerator',function(){
		it('should call composeWith',function(){
			sinon.stub(this.helper.gen,'composeWith');

			this.helper.callSubgenerator('NAME');

			assert(this.helper.gen.composeWith.calledOnce);

			this.helper.gen.composeWith.restore();
		});
		it('should call logger',function(){
			sinon.stub(this.helper.gen,'composeWith');
			sinon.stub(this.helper.logger,'info');

			this.helper.callSubgenerator('NAME');

			assert(this.helper.logger.info.calledOnce);

			this.helper.logger.info.restore();
		});
	});

	describe('#getLicense',function(){
		it('calls licenser with good arguments',function(){
			sinon.stub(this.helper,'getYoRc')
				.returns('licenseName');
			sinon.stub(licenser,'getLicense')
				.returns('licenseContent');

			this.helper.getLicense();

			assert(licenser.getLicense.withArgs(
				'licenseName',
				sinon.match.number,
				sinon.match.string
			));

			this.helper.getYoRc.restore();
			licenser.getLicense.restore();
		});
	});

	describe('#generateModule',function(){
		it('logs informations and call generate',function() {
			sinon.spy(this.helper.logger, 'info');
			sinon.stub(this.helper, 'generate');
			var done = sinon.stub();

			this.helper.generateModule('moduleName',done);

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

	describe('#generateBase',function(){
		it('logs informations and call generate on setupBase and base',function(){
			sinon.spy(this.helper.logger, 'info');
			sinon.stub(this.helper, 'generate');

			this.helper.generateBase('baseName',function(){});

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

	describe('#generate',function(){
		beforeEach(function(){
			this.getLicense = sinon.stub(this.helper,'getLicense');
			this.getSetupEjs = sinon.stub(this.helper.ENV.path.temp,'getSetupEjs');
			this.getYoRc = sinon.stub(this.helper,'getYoRc');
			this.fsWrite = sinon.stub(this.helper.gen.fs,'write');
			this.fsCopy = sinon.stub(this.helper.gen.fs,'copy');
			this.debug = sinon.stub(this.helper.logger,'debug');

			this.fromDir = path.join(__dirname,'../../data/helper/generate/fromDir');

			this.getSetupEjs.returns(path.join(__dirname,'../../data/helper/generate/setupEjs'));
			this.getLicense.returns('licenseContent');
			this.getYoRc.returns({
				getYoRc_key0 : 'getYoRc_value0',
				getYoRc_key1 : 'getYoRc_value1'
			});
		});

		afterEach(function(){
			this.helper.getLicense.restore();
			this.getSetupEjs.restore();
			this.getYoRc.restore();
			this.fsWrite.restore();
			this.fsCopy.restore();
			this.debug.restore();
		});

		it('should write editable files and copy unditable and log',function(done){
			var self = this;

			this.helper.generate(this.fromDir,'toDir',function(){

				var error = 0;

				assert(self.debug.withArgs('Write:','toDir/file0').calledOnce,'Err: ' + error++);
				assert(self.fsWrite.withArgs('toDir/file0','content0').calledOnce,'Err: ' + error++);

				assert(self.debug.withArgs('Write:','toDir/file1').calledOnce,'Err: ' + error++);
				assert(self.fsWrite.withArgs('toDir/file1','content1').calledOnce,'Err: '+error++);

				assert(self.debug.withArgs('Write:','toDir/dir0/file0').calledOnce,'Err: '+error++);
				assert(self.fsWrite.withArgs('toDir/dir0/file0','dir0.content0').calledOnce,'Err: '+error++);

				assert(self.debug.withArgs('Write:','toDir/getYoRc_value0/getYoRc_value1').calledOnce,'Err: '+error++);
				assert(self.fsWrite.withArgs('toDir/getYoRc_value0/getYoRc_value1','value0').calledOnce,'Err: '+error++);

				assert(self.debug.withArgs('Copy:', 'toDir/getYoRc_value0/mp3.py').calledOnce,'Err: '+error++);
				assert(self.fsCopy.withArgs(
					path.join(self.fromDir,'<%-getYoRc_key0%>/mp3.py'),
                    'toDir/getYoRc_value0/mp3.py').calledOnce,'Err: '+error++);

				done();
			});
		});

	});

	describe('#runLineInjector',function(){
		beforeEach(function(){
			this.injectLines = sinon.stub(utils,'injectLines');
			this.getSetupInjector = sinon.stub(this.helper.ENV.path.temp,'getSetupInjector');
			this.fsWrite = sinon.stub(this.helper.gen.fs,'write');
			this.info = sinon.stub(this.helper.logger,'info');
			this.debug = sinon.stub(this.helper.logger,'debug');

			this.getSetupInjector.returns(
				path.join(__dirname,'../../data/helper/runLineInjector/injector')
			);

			this.injectLines.returns(
				'injectLines'
			);

		});
		afterEach(function(){
			this.injectLines.restore();
			this.getSetupInjector.restore();
			this.fsWrite.restore();
			this.info.restore();
			this.debug.restore();
		});

		it('should log and write',function(){
			var self = this;

			this.helper.runLineInjector('injectorName');

			var error = 0;

            assert(self.fsWrite.withArgs(sinon.match.string,'injectLines').calledOnce,'Err: ' + error++);
            assert(self.info.withArgs('Run line injector:','injectorName').calledOnce,'Err: ' + error++);
            assert(self.debug.withArgs('Inject:',{
                filePath: sinon.match.string,
                lineFlag: 'flag',
                injectArr: ['line0','line1']
            }).calledOnce,'Err: ' + error++);
		});
	});

	describe('#callSubgeneratorMethod',function(){

		beforeEach(function(){
			this.helper.gen.methodName = function(){};

			this.methodName = sinon.stub(this.helper.gen,'methodName');
			this.info = sinon.stub(this.helper.logger,'info');
		});

		afterEach(function(){
			this.methodName.restore();
			this.info.restore();
		});

		it('call method if exist and log',function(){
			this.helper.callSubgeneratorMethod('methodName');

			assert(this.methodName.calledOnce);
			assert(this.info.withArgs('Call subgenerator method:','methodName').calledOnce);
		});

		it('call method and log if dont exist',function(){
			this.helper.callSubgeneratorMethod('NOT_EXIST');

			assert(!this.methodName.calledOnce);
			assert(!this.info.calledOnce);
		});
	});
});
