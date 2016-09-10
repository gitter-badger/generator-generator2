'use strict';

var assert = require('assert');
var yoAssert = require('yeoman-assert');
var Helper = require('../helper');

var helper = new Helper('java','CLI');

describe(helper.describe(), function () {

	before(function () {
		return helper.runGenerator();
	});

	it('Creates default files', function () {
		yoAssert.file([
			'.yo-rc.json',
			'LICENSE'
		]);
	});

	it('Creates base specific files', function () {
		yoAssert.file([
			'src/main/java/app/cmd'
		]);
	});

	describe('database subgenerator:',function(){

		before(function () {
			return helper.runSubgenerator('database');
		});

		it('Creates default files',function(){
			yoAssert.file([
				'src/main/java/app/db/Db.java'
			]);
		});

		it('Injects text to files');
	});

});


