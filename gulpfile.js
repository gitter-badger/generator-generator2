'use strict';
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var coveralls = require('gulp-coveralls');
var jsdoc = require('gulp-jsdoc3');
var shell = require('gulp-shell');

gulp.task('mkdocs', shell.task([
	'mkdocs build --clean --quiet --config-file ./config/mkdocs.yml'
]));

gulp.task('static', function () {
	var config = require('./config/eslint.json');
	return gulp.src('**/*.js')
		.pipe(excludeGitignore())
		.pipe(eslint(config))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
	nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function () {
	return gulp.src('generators/**/*.js')
		.pipe(excludeGitignore())
		.pipe(istanbul({
			includeUntested: true
		}))
		.pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
	var mochaErr;

	gulp.src([
		'test/**/*.js',
		'e2e/cli/**/*.js'
	]).pipe(plumber())
		.pipe(mocha({reporter: 'spec'}))
		.on('error', function (err) {
			mochaErr = err;
		})
		.pipe(istanbul.writeReports({
			dir: "./build/coverage",
			reportOpts: {dir: './build/coverage'}
		}))
		.on('end', function () {
			cb(mochaErr);
		});
});

gulp.task('docs', function (cb) {
	var config = require('./config/jsdoc.json');
	gulp.src([
		'./generators/**/*.js',
		'./README.md'
	], {read: false})
		.pipe(jsdoc(config, cb));
});

gulp.task('e2e', function (cb) {
	var mochaErr;

	gulp.src([
		'e2e/cli/**/*.js',
		'e2e/build/**/*.js'
	]).pipe(plumber())
		.pipe(mocha({reporter: 'spec'}))
		.on('error', function (err) {
			mochaErr = err;
		})
		.on('end', function () {
			cb(mochaErr);
		});
});

gulp.task('watch', function () {
	gulp.watch(['generators/**/*.js', 'test/**'], ['test']);
});

gulp.task('coveralls', ['test'], function () {
	if (!process.env.CI) {
		return;
	}

	return gulp.src(path.join(__dirname, 'build/coverage/lcov.info'))
		.pipe(coveralls());
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test', 'coveralls']);
