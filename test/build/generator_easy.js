'use strict';

var assert = require('assert');
var yoAssert = require('yeoman-assert');
var nexpect = require('nexpect');
var path = require('path');
var process = require('process');

describe('generator easy build:', function () {

	const genPath = path.join(__dirname, '../../build/generator/easy');
	const npmTask = function (task) {
		if (!task)
			task = ' ls';
		else
			task = ' ' + task;
		return 'npm' + task;
	};


	beforeEach(function(){
		process.chdir(genPath)
	});

	afterEach(function(){
		process.chdir(path.join(__dirname,'../..'));
	});

	it('Should exist in build folder', function () {
		yoAssert.file([genPath]);
	});

	describe('npm tool:', function () {

		it('package.json should exist', function () {
			yoAssert.file([
				'package.json'
			]);
		});

		it('default task should pass', function (done) {
			this.timeout(10000);

			nexpect
				.spawn(npmTask())
				.run(function (err, stdout, exitcode) {
					assert.equal(exitcode, 0, stdout);
					done(err);
				});
		});

	});

});


