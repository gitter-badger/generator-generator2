'use strict';

var assert = require('assert');
var yoAssert = require('yeoman-assert');
var nexpect = require('nexpect');
var path = require('path');

describe('java CLI build:', function () {

	const genPath = path.join(__dirname, '../../build/java/CLI');
	const gradleTask = function (task) {
		if (!task)
			task = '';
		else
			task = ' ' + task;
		return 'gradle --project-dir ' + genPath + task;
	};

	it('Should exist in build folder', function () {
		yoAssert.file([genPath]);
	});

	describe('gradle build tool:', function () {

		it('build.gradle should exist', function () {
			yoAssert.file([
				path.join(genPath, 'build.gradle')
			]);
		});

		it('default task should pass', function (done) {
			this.timeout(10000);
			nexpect
				.spawn(gradleTask())
				.run(function (err, stdout, exitcode) {
					assert.equal(exitcode, 0, 'Exit code: ' + exitcode);
					done(err);
				});
		});

		it('test task should pass', function (done) {
			this.timeout(50000);
			nexpect
				.spawn(gradleTask('test'))
				.run(function (err, stdout, exitcode) {
					assert.equal(exitcode, 0, 'Exit code: ' + exitcode);
					done(err);
				});
		});

	});

});


