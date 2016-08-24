'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs-extra');

describe('java:CLI', function () {
	before(function () {
		return helpers.run(path.join(__dirname, '../../generators/app'))
			.withPrompts({
				"name": "projectName",
				"description": "This is project name description for the readme itd...",
				"repoUrl": "https://github.com/urosjarc/projectName",
				"siteUrl": "https://urosjarc.github.io/projectName",
				"license": "MIT License",
				"githubUser": "urosjarc",
				"authorName": "Uros Jarc",
				"versionEyeApiKey": "35bce4377c237824ed6e",
				"language": "java",
				"groupId": "com.github.urosjarc",
				"base": "CLI"
			}).toPromise();
	});

	it('creates files', function () {
		assert.file([
			'.yo-rc.json',
			'README.md'
		]);
	});
});


