'use strict';
var path = require('path');
var gulp = require('gulp');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var codacy = require('gulp-codacy');
var jsdoc = require('gulp-jsdoc3');
var shell = require('gulp-shell');
var chalk = require('chalk');
var fs = require('fs');
var childProcess = require('child_process');
var browserSync = require('browser-sync').create();
var ghPages = require('gulp-gh-pages');
var yaml = require('js-yaml');
var checkDeps = require('gulp-check-deps');

var mkdocsConfig = './config/mkdocs.yml';
var eslintConfig = './config/eslint.json';
var jsdocConfig = './config/jsdoc.json';

gulp.task('static', function () {
	if (!/(v0.12|v0.10)/.test(process.version)) {
		var eslint = require('gulp-eslint');
		var config = require(eslintConfig);
		return gulp.src('**/*.js')
			.pipe(excludeGitignore())
			.pipe(eslint(config))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
	}
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

gulp.task('test:dep', function () {
	return gulp.src('package.json').pipe(checkDeps());
});

gulp.task('test:docs', function () {
	childProcess.execSync('./node_modules/.bin/inchjs --all');
	var docs = require('./docs.json');
	var report = [];

	var undocs = 0;
	for (var i in docs.objects) {
		var object = docs.objects[i];
		if (object.undocumented == true) {
			report.push(
				' - ' + object.meta.path + ' '
				+ object.meta.filename + ' '
				+ object.meta.lineno
			);
			undocs++;
		}
	}
	if (undocs != 0) {
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

gulp.task('coverage', function codacyTask() {

	if (!process.env.CI) {
		return;
	}

	return gulp
		.src(['build/coverage/lcov.info'], {read: false})
		.pipe(codacy({
			token: '5723c4e3999649228cb540e0c048a3e2'
		}));
});

gulp.task('serve', ['docs'], function () {
	browserSync.init({
		server: {
			baseDir: "build/docs"
		}
	});

	gulp.watch([
		'generators/**/*.js',
		'lib/**/*.js',
		'docs/**/*',
		'config/mkdocs.yml'
	], ['docs', function () {
		browserSync.reload();
	}]);
});

gulp.task('gh-pages', ['docs'], function () {
	return gulp.src('build/docs/**/*')
		.pipe(ghPages({
			cacheDir: 'build/gh-pages'
		}));
});

gulp.task('mkdocs', shell.task([
	'mkdocs build --strict --clean --quiet --config-file ' + mkdocsConfig
]));

gulp.task('jsdoc', function (cb) {
	var config = require(jsdocConfig);
	gulp.src([
		'./lib/**/*.js',
		'./README.md'
	], {read: false})
		.pipe(jsdoc(config, cb));
});

gulp.task('prepublish', ['nsp'], function () {
	var mkdocs = yaml.safeLoad(fs.readFileSync(mkdocsConfig, 'utf8'));
	mkdocs.extra.version = require('./package.json').version;
	console.log('\n > Version: ' + mkdocs.extra.version + '\n');
	fs.writeFileSync(mkdocsConfig, yaml.safeDump(mkdocs));
});

gulp.task('docs', ['mkdocs', 'jsdoc']);
gulp.task('default', [
	// 'static',
	'test:dep',
	'test',
	'coverage'
	// 'test:docs'
]); //Todo: Set static + test:docs
