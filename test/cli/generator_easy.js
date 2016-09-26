'use strict';

var assert = require('assert');
var yoAssert = require('yeoman-assert');
var Helper = require('./helper');

var helper = new Helper('generator','easy');

describe(helper.describe(), function () {

	before(function () {
		return helper.runGenerator();
	});

	it('Creates default files', function () {
		yoAssert.file([
			'EASY'
		]);
	});

	it('Creates base specific files', function () {
		yoAssert.file([
			'BASE'
		]);
	});

	describe('module subgenerator:',function(){

		before(function () {
			return helper.runSubgenerator('subgenerator');
		});

		it('Creates default files',function(){
			yoAssert.file([
				'SUBGENERATOR'
			]);
		});

		it('Injects SUBGENERATOR',function(){
			helper.assertContent('SUBGENERATOR',[
				/yeoman_line/,
				/yeoman_line1/
			]);
		});
	});

});


