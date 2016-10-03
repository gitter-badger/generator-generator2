'use strict';

var assert = require('assert');
var yoAssert = require('yeoman-assert');
var Helper = require('./helper');

var helper = new Helper('generator', 'default');

describe(helper.describe(), function () {

	before(function () {
		return helper.runGenerator();
	});

	it('Creates default files', function () {
		yoAssert.file([
			'LICENSE',
			'package.json',
			'README.md',
			'gulpfile.js',
			'.travis.yml',
			'.gitignore',
			'.editorconfig',
			'docs',
			'config'
		]);
	});

	it('Creates base specific files', function () {
		yoAssert.file([
			'EASY'
		]);
	});

	describe('module subgenerator:', function () {

		before(function () {
			return helper.runSubgenerator('subgenerator');
		});

		it('Creates default files', function () {
			yoAssert.file([
				'SUBGENERATOR'
			]);
		});

		it('Injects SUBGENERATOR', function () {
			// helper.assertContent('SUBGENERATOR', [
			// 	/yeoman_line/,
			// 	/yeoman_line1/
			// ]);
		});
	});

});


