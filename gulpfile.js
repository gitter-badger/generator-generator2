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
var process = require('process');
var chalk = require('chalk');
var childProcess = require('child_process');
var browserSync = require('browser-sync').create();

var mkdocsConfig = './config/mkdocs.yml';
var eslintConfig = './config/eslint.json';
var jsdocConfig = './config/jsdoc.json';

gulp.task('static', function () {
	var config = require(eslintConfig);
	return gulp.src('**/*.js')
		.pipe(excludeGitignore())
		.pipe(eslint(config))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
	nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('test:pre', function () {
	return gulp.src([
		'generators/**/*.js',
		'lib/**/*.js'
	])
		.pipe(excludeGitignore())
		.pipe(istanbul({
			includeUntested: true
		}))
		.pipe(istanbul.hookRequire());
});

gulp.task('test:docs',function(){
	childProcess.execSync('./node_modules/.bin/inchjs --all');
	var docs = require('./docs.json');
	var report = [];

	var undocs = 0;
	for(var i in docs.objects){
		var object = docs.objects[i];
		if(object.undocumented == true){
			report.push(
				' - ' + object.meta.path + ' '
				+ object.meta.filename + ' '
				+ object.meta.lineno
			);
			undocs++;
		}
	}
	if(undocs!=0){
		console.error(chalk.red(
			'\n > Undocumented:\n' +
			report.join('\n')
		));
		process.exit(1);
	}
});

gulp.task('test', ['test:pre'], function (cb) {
	var mochaErr;

	gulp.src([
		'test/lib/**/*.js',
		'test/cli/**/*.js'
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

gulp.task('e2e', function (cb) {
	var mochaErr;

	gulp.src([
		'test/cli/**/*.js',
		'test/build/**/*.js'
	]).pipe(plumber())
		.pipe(mocha({reporter: 'spec'}))
		.on('error', function (err) {
			mochaErr = err;
		})
		.on('end', function () {
			cb(mochaErr);
		});
});

gulp.task('coveralls', ['test'], function () {
	if (!process.env.CI) {
		return;
	}

	return gulp.src(path.join(__dirname, 'build/coverage/lcov.info'))
		.pipe(coveralls());
});

gulp.task('serve:update',['docs'], function (done) {
	browserSync.reload();
	done();
});

gulp.task('serve',['docs'], function () {
	browserSync.init({
		server: {
			baseDir: "build/docs"
		}
	});

	gulp.watch([
		'generators/**/*.js',
		'lib/**/*.js',
		'docs/**/*'
	], ['serve:update']);
});

gulp.task('mkdocs:build', shell.task([
	'mkdocs build --strict --clean --quiet --config-file ' + mkdocsConfig
]));

gulp.task('mkdocs:deploy', shell.task([
	'mkdocs gh-deploy --quiet --config-file ' + mkdocsConfig
]));

gulp.task('jsdoc', function (cb) {
	var config = require(jsdocConfig);
	gulp.src([
		'./lib/**/*.js',
		'./README.md'
	], {read: false})
		.pipe(jsdoc(config, cb));
});

gulp.task('docs', ['mkdocs:build','jsdoc']);
gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test', 'coveralls','test:docs']);
