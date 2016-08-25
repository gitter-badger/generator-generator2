'use strict';

var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fun = require('../helpers');
var fse = require('fs-extra');
var path = require('path');

var L = 'java';
var B = 'CLI';
var testPath = L + '_' + B;

describe(fun.getText([L, B]), function () {

	var tempTestingDir = null;

	before(function () {
		return helpers
			.run(fun.getGenPath())
			.inTmpDir(function (dir) {
				tempTestingDir = dir;
			})
			.withPrompts(fun.getPrompt(L, B))
			.toPromise()
			.then(function () {
				fse.copySync(tempTestingDir, fun.getTestPath(testPath));
			});
	});

	it('Creates default files.', function () {
		assert.file([
			'.yo-rc.json',
			'LICENSE'
		]);
	});

	it('Creates base specific files.', function () {
		assert.file([
			'src/main/java/app/cmd'
		]);
	});

	describe(fun.getText([L, B, 'database']), function () {

		before(function () {
			return helpers
				.run(fun.getGenPath())
				.inTmpDir(function (dir) {
					tempTestingDir = dir;
				})
				.withLocalConfig(fun.getConfig(L, B, true))
				.withPrompts({
					"module": "database"
				}).toPromise()
				.then(function () {
					fse.copySync(tempTestingDir, fun.getTestPath(testPath));
				});
		});

		it('Creates base specific files.', function () {
			assert.file([
				'src/main/java/app/db'
			]);
		});

	});
});


