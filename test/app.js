'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-generate:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
		.inDir('testing')
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
          "groupId": "com.github.urosjarc"
	  }).toPromise();
  });

  it('creates files', function () {
    assert.file([
      'dummyfile.txt'
    ]);
  });
});
