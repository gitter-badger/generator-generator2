'use strict';

var assert = require('assert');
var yoAssert = require('yeoman-assert');
var GenHelp = require('../GenHelp');

var genHelp = new GenHelp('java','CLI');

describe(genHelp.describe(), function () {

	before(function () {
		return genHelp.runGenerator();
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
			return genHelp.runSubgenerator('database');
		});

		it('Creates default files',function(){
			yoAssert.file([
				'src/main/java/app/db/Db.java'
			]);
		});

		it('Injects text to files');
	});

});


