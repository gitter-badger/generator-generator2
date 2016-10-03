'use strict';

var assert = require('assert');
var path = require('path');
var fs = require('fs');

var utils = require('../../lib/utils');

describe('utils', function () {

	var getUtilsPath = function (fsPath) {
		return path.join(__dirname, '../data/utils', fsPath || '');
	};

	describe('#validateWord', function () {
		it('return true on nice word', function () {
			assert.equal(utils.validateWord('aA._-'), true);
		});

		it('return false on space', function () {
			assert.equal(
				typeof utils.validateWord('word word'),
				'string'
			);
		});

		it('return false on bad character', function () {
			assert.equal(
				typeof utils.validateWord('?'),
				'string'
			);
		});
	});

	describe('#validateUrl', function () {
		it('pass on good url', function () {
			assert.equal(utils.validateUrl('https://github.com'), true);
		});

		it('fail on bad url', function () {
			assert.equal(typeof utils.validateUrl('https:// github.com'), 'string');
		});
	});

	describe('#validateEmail', function () {
		it('pass on good email', function () {
			assert.equal(utils.validateEmail('username@gmail.com'), true);
		});

		it('fail on bad email', function () {
			assert.equal(typeof utils.validateEmail('user name@gmail.com'), 'string');
		});
	});

	describe('#validateGeneratorName', function () {
		it('return true on good name', function () {
			assert(utils.testGeneratorName('generator-name'));
		});
		it('return false on bad name', function () {
			assert(!utils.testGeneratorName('generatorName.js'));
		});
	});

	describe('#getAllFilesPaths', function () {
		beforeEach(function () {
			var dir = getUtilsPath('getAllFilesPaths');
			this.return = utils.getAllFilesPaths(dir);
			for (var i in this.return) {
				this.return[i] = this.return[i].replace(dir, '');
			}
		});

		it('returns arr of paths', function () {
			assert.deepEqual(
				this.return,
				[
					'/dir/test',
					'/test'
				]
			);
		});

		it('fail on false dir', function (done) {
			try {
				utils.getAllFilesPaths(path.join(__dirname, 'utils.js'));
				done('Should not pass');
			} catch (err) {
				assert(/ENOTDIR/.test(err.message));
				done();
			}
		});
	});

	describe('#injectLines', function () {
		beforeEach(function () {
			this.passPath = getUtilsPath('injectLines/pass');
			this.returnPass = utils.injectLines(
				this.passPath,
				'#line2', ['line21', 'line22']
			);
		});

		it('return injected content', function () {
			assert.equal(this.returnPass, [
				'line1',
				'\t #line2',
				'\t line21',
				'\t line22',
				'\t\tline3'
			].join('\n'));
		});

		it('fail on bad path', function (done) {
			try {
				utils.injectLines(__dirname, 'NOT_FOUND', []);
				done('Should not pass');
			} catch (err) {
				assert(/EISDIR/.test(err.message));
				done();
			}
		});

		it('fail on flag not found', function (done) {
			try {
				utils.injectLines(this.passPath, 'NOT_FOUND', []);
				done('Should not pass');
			} catch (err) {
				assert(/Line flag \(NOT_FOUND\) not found!/.test(err.message));
				done();
			}
		});
	});

	describe('#yamlToJson', function () {
		beforeEach(function () {
			this.coruptPath = getUtilsPath('yamlToJson/corupt');
			this.passPath = getUtilsPath('yamlToJson/pass');
		});
		it('returns json content', function () {
			assert.deepEqual(utils.yamlToJson(this.passPath), {
				'./file': {
					flag: 'flag',
					text: 'line0\nline1'
				}
			});
		});

		it('fail on bad yaml content', function (done) {
			try {
				utils.yamlToJson(this.coruptPath);
				done('Should not pass');
			} catch (err) {
				assert(/bad indentation/.test(err.message));
				assert(/data\/utils\/yamlToJson\/corupt/.test(err.message));
				done();
			}
		});

		it('fail on non existing path', function (done) {
			try {
				utils.yamlToJson(path.join(__dirname, 'NOT_EXIST'));
				done('Should not pass');
			} catch (err) {
				assert(/ENOENT/.test(err.message));
				assert(/NOT_EXIST/.test(err.message));
				done();
			}
		});
	});

	describe('#getNowDate', function () {
		it('should be the right format', function () {
			assert(/\d{1,2}.\d{1,2}.\d{4}/.test(
				utils.getNowDate()
			));
		});
	});

	describe('#getJsonValue', function () {

		beforeEach(function () {
			this.json = {
				key: 'value',
				key1: {
					key1key: 'key1.value'
				},
				key2: [
					'key2.value'
				]
			}
		});

		it('gets whole json', function () {
			var json = utils.getJsonValue([], this.json);
			assert.deepEqual(json, this.json);
		});

		it('gets value on first level', function () {
			var value = utils.getJsonValue(['key'], this.json);
			assert.equal(value, this.json.key);
		});

		it('gets value on second level', function () {
			var value = utils.getJsonValue(['key1', 'key1key'], this.json);
			assert.equal(value, this.json.key1.key1key);
		});

		it('gets value from array', function () {
			var value = utils.getJsonValue(['key2', 0], this.json);
			assert.equal(value, this.json.key2[0]);
		});

		it('returns undefined', function () {
			var value = utils.getJsonValue(['NOT_EXIST'], this.json);
			assert.equal(value, undefined);
		});

		it('returns undefined on second level', function () {
			var value = utils.getJsonValue(['key1', 'key1key', 'NOT_EXIST'], this.json);
			assert.equal(value, undefined);
		})

	});

	describe('#setJsonValue', function () {

		beforeEach(function () {
			this.json = {
				key: 'value',
				key1: {
					key1key: 'key1.value'
				},
				key2: [
					'key2.value'
				]
			}
		});

		it('sets value on first level', function () {
			var json = utils.setJsonValue(['key'], 'newValue', this.json);
			this.json.key = 'newValue';
			assert.deepEqual(json, this.json);
		});

		it('sets value on second level', function () {
			var json = utils.setJsonValue(['key1', 'key1key'], 'key1.newValue', this.json);
			this.json.key1.key1key = 'newValue';
			assert.deepEqual(json, this.json);
		});

		it('sets value in array', function () {
			var json = utils.setJsonValue(['key2', 0], 'key2.newValue', this.json);
			this.json.key2[0] = 'key2.newValue';
			assert.deepEqual(json, this.json);
		});

		it('create key on first level', function () {
			var json = utils.setJsonValue(['NOT_EXIST'], 'newValue', this.json);
			this.json.NOT_EXIST = 'newValue';
			assert.deepEqual(json, this.json);
		});

		it('create key on second level', function () {
			var json = utils.setJsonValue(['NOT_EXIST', 'NOT_EXIST'], 'newValue', this.json);
			this.json.NOT_EXIST = {
				NOT_EXIST: 'newValue'
			};
			assert.deepEqual(json, this.json);
		});

		it('create key on third level', function () {
			var json = utils.setJsonValue(['NOT_EXIST', 'NOT_EXIST', 'NOT_EXIST'], 'newValue', this.json);
			this.json.NOT_EXIST = {
				NOT_EXIST: {
					NOT_EXIST: 'newValue'
				}
			};
			assert.deepEqual(json, this.json);
		});

	});

	describe('#isEditable', function () {
		beforeEach(function () {
			var failPath = getUtilsPath('isEditable/fail');
			var passPath = getUtilsPath('isEditable/pass');
			this.passPathsArr = fs.readdirSync(passPath);
			this.failPathsArr = fs.readdirSync(failPath);
			for (var i in this.passPathsArr) {
				this.passPathsArr[i] = path.join(passPath, this.passPathsArr[i]);
			}
			for (var i in this.failPathsArr) {
				this.failPathsArr[i] = path.join(failPath, this.failPathsArr[i]);
			}
		});
		it('pass on editable file', function (done) {
			var self = this;
			var finish = false;
			for (var i in this.passPathsArr) {
				utils.isEditable(this.passPathsArr[i], function (err, pass) {
					if (err) done(err);
					assert(pass, 'File should be editable ' + self.passPathsArr[i]);
					if (i == self.passPathsArr.length - 1 && !finish) {
						done();
						finish = true;
					}
				});
			}
		});
		it('fails on uneditable file', function (done) {
			var self = this;
			var finish = false;
			for (var i in this.failPathsArr) {
				utils.isEditable(this.failPathsArr[i], function (err, pass) {
					if (err) done(err);
					assert(!pass, 'File should not be editable' + self.failPathsArr[i]);
					if (i == self.failPathsArr.length - 1 && !finish) {
						done();
						finish = true;
					}
				});
			}
		});
		it('throw error on non existing path', function (done) {
			utils.isEditable(path.join(__dirname, 'NOT_EXIST'), function (err) {
				assert(/ENOENT/.test(err.message));
				assert(/NOT_EXIST/.test(err.message));
				done();
			});
		});

		it('throw error if path is directory', function (done) {
			utils.isEditable(__dirname, function (err, pass) {
				if (err) done(err);
				assert(!pass);
				done();
			});
		});
	});

	describe('#ejsRender', function () {
		beforeEach(function () {
			this.passPath = getUtilsPath('ejsRender/pass');
		});
		it('returns rendered path', function () {
			assert.equal(utils.ejsRender(
				this.passPath, {content: 'content'}),
				'content'
			);
		});
		it('throw error on bad path', function (done) {
			try {
				utils.ejsRender(path.join(__dirname, 'NOT_EXIST'), {});
				done('Should not pass');
			} catch (err) {
				assert(/ENOENT/.test(err.message));
				assert(/NOT_EXIST/.test(err.message));
				done();
			}

		});

	});

});
