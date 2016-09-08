'use strict';

var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fun = require('../config');
var path = require('path');

describe('Java CLI generator', function () {

	before(function () {
		return helpers
			.run(fun.getGenPath())
			.withPrompts(fun.getPrompt('java','CLI'))
			.toPromise();
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

});


