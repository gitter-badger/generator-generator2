'use strict';

var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fsx = require('fs-extra');
var config = require('../../config/test');

var L = 'java';
var B = 'CLI';
var testPath = L + '_' + B;

describe(config.getText([L,B]), function () {

	before(function () {
		return helpers
            .run(config.getGenPath())
            .inTmpDir(function(dir){
				var done = this.async();
				//Todo: Copy dir to java_cli
			})
            .withPrompts(config.getPrompt(L,B))
            .toPromise();
	});

	it('creates files', function () {
		console.log('1 it...');
		assert.file([
			'.yo-rc.json',
			'README.md'
		]);
	});

	describe(config.getText([L,B,'database']), function () {

		console.log('2 describe...');
		before(function () {
			return helpers
				.run(config.getGenPath())
				.inDir(config.getTestPath(testPath))
				.withLocalConfig(config.getConfig(L,B))
				.withPrompts({
					"module": "database"
				}).toPromise();
		});

		it('creates files', function () {
			console.log('2 it...');
			assert.file([
				'src/main/java/app/db'
			]);
		});

	});
});


