'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs-extra');

describe('java:CLI:database', function () {

	before(function () {
		return helpers.run(path.join(__dirname, '../../generators/app'))
			.withLocalConfig({
				app: {
					name: 'projectName',
					description: 'This is project name description for the readme itd...',
					repoUrl: 'https://github.com/urosjarc/projectName',
					siteUrl: 'https://urosjarc.github.io/projectName',
					license: 'MIT License',
					githubUser: 'urosjarc',
					authorName: 'Uros Jarc',
					versionEyeApiKey: '35bce4377c237824ed6e',
					language: 'java',
					createdAt: '6/7/2016'
				},
				java: {groupId: 'com.github.urosjarc'},
				subgenerator: {base: 'CLI'},
				inited: true
			})
			.withPrompts({
				"module": "database"
			}).toPromise();
	});

	it('creates files', function () {
		assert.file([
			'src/main/java/app/db'
		]);
	});

});
