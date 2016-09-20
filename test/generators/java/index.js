var assert = require('assert');
var sinon = require('sinon');
var yoEnv = require('yeoman-environment');

var javaSubGen = require('../../../generators/java');

describe('java subgenerator', function () {

	beforeEach(function () {
		this.javaSubGen = new yoEnv().instantiate(javaSubGen);
	});
	
	describe('#shell',function(){
		it('should exist',function(){
			this.javaSubGen.shell();
		});
	});

	describe('#CLI',function(){
		it('should exist',function(){
			this.javaSubGen.CLI();
		});
	});
	describe('#javaFx',function(){
		it('should exist',function(){
			this.javaSubGen.javaFx();
		});
	});
	describe('#database',function(){
		it('should exist',function(){
			this.javaSubGen.database();
		});
	});
	
});
