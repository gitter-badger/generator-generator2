'use strict';

var path = require('path');
var fs = require('fs');

var chalk = require('chalk');
var browserSync = require('browser-sync').create();
var yaml = require('js-yaml');

var gulp = require('gulp-help')(require('gulp'));
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var codacy = require('gulp-codacy');
var jsdoc = require('gulp-jsdoc3');
var shell = require('gulp-shell');
var ghPages = require('gulp-gh-pages');
var checkDeps = require('gulp-check-deps');

var mkdocsConfig = './config/mkdocs.yml';
var eslintConfig = './config/eslint.json';
var jsdocConfig = './config/jsdoc.json';
var checkDepConfig = './config/checkDep.json';
var codacyConfig = './config/codacy.json';
var changelogConfig = './config/changelog.json';

gulp.task('static', 'Lint *.js project files.', function () {
	if (!/(v0.12|v0.10)/.test(process.version)) {
		var eslint = require('gulp-eslint');
		var config = require(eslintConfig);
		return gulp.src([
			'**/*.js'
		])
			.pipe(excludeGitignore())
			.pipe(eslint(config))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
	}
});

gulp.task('nsp', 'Run node security checks.', function (cb) {
	nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('test:pre', false, function () {
	return gulp.src([
		'generators/**/*.js',
		'!**/templates/**/*.js',
		'lib/**/*.js'
	])
		.pipe(excludeGitignore())
		.pipe(istanbul({
			includeUntested: true
		}))
		.pipe(istanbul.hookRequire());
});

gulp.task('test:dep', 'Test project dependencies for deprecation.', function () {
	var config = require(checkDepConfig);
	return gulp
		.src('package.json')
		.pipe(checkDeps(config));
});

gulp.task('test:docs', 'Test project documentations.', ['inchjs'], function () {
	var docs = require('./docs.json');
	for (var i in docs.objects) {
		if (docs.objects[i].undocumented == true) {
			process.exit(1);
		}
	}
});

gulp.task('test', 'Run integration/unit tests.', ['test:pre'], function (cb) {
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

gulp.task('e2e', 'Run end to end tests.', function (cb) {
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

gulp.task('coverage', false, function codacyTask() {

	if (!process.env.CI) {
		return;
	}

	var config = require(codacyConfig);

	return gulp
		.src(['build/coverage/lcov.info'], {read: false})
		.pipe(codacy(config));
});

gulp.task('serve', 'Build, serve documentation and reload on docs change.', ['docs'], function () {
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

gulp.task('gh-pages', 'Upload documentation to github pages.', ['docs'], function () {
	return gulp.src('build/docs/**/*')
		.pipe(ghPages({
			cacheDir: 'build/gh-pages'
		}));
});

gulp.task('inchjs', false, shell.task([
	'./node_modules/.bin/inchjs --all'
]));

gulp.task('mkdocs', false, shell.task([
	'mkdocs build --strict --clean --quiet --config-file ' + mkdocsConfig
]));

gulp.task('jsdoc', false, function (cb) {
	var config = require(jsdocConfig);
	gulp.src([
		'./lib/**/*.js',
		'docs/documentation.md'
	], {read: false})
		.pipe(jsdoc(config, cb));
});

gulp.task('changelog', 'Update docs changelog file.',function(cb){
	var command = 'github_changelog_generator';
	var config = require(changelogConfig);
	for(var i in config){
		command += ' --' + i + ' ' + config[i];
	}
	shell.task([ command ])(cb);
});

gulp.task('prepublish', false, ['nsp'], function () {
	var mkdocs = yaml.safeLoad(fs.readFileSync(mkdocsConfig, 'utf8'));
	mkdocs.extra.version = require('./package.json').version;
	console.log('\n > Version: ' + mkdocs.extra.version + '\n');
	fs.writeFileSync(mkdocsConfig, yaml.safeDump(mkdocs));
});

gulp.task('docs', 'Build project documentation.', ['mkdocs', 'jsdoc']);

gulp.task('test:CI', 'Run continuous integration test suite.', [
	'test',
	'coverage',
	'static',
	'test:docs',
	'test:dep'
]);
