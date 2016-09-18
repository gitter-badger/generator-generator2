var assert = require('assert');
var path = require('path');
var fs = require('fs');
var sinon = require('sinon');
var yoEnv = require('yeoman-environment');
var process = require('process');
var licenser = require('licenser');

var utils = require('../../../generators/app/utils');
var generator = require('../../data/helper/generator-simple');
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
			testGeneratorName.onFirstCall().returns(false);
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
				.withArgs('app.license')
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
		it('should exist and be function',function(){
			assert.equal(typeof this.helper.generate,'function');
		});
	});
});
