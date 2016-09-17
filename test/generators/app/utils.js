'use strict';

var assert = require('assert');
var utils = require('../../../generators/app/utils');
var sinon = require('sinon');
var assert = require('assert');

describe('utils', function () {

	describe('#validateWord',function(){
		it('return true on nice word',function(){
			assert.equal(utils.validateWord('aA._-'),true);
		});

		it('return false on space',function(){
			assert.equal(
				typeof utils.validateWord('word word'),
				'string'
			);
		});

		it('return false on bad character',function(){
			assert.equal(
				typeof utils.validateWord('?'),
				'string'
			);
		});
	});

	describe('#validateUrl',function(){

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
			var json = utils.setJsonValue(['key'],'newValue',this.json);
			this.json.key = 'newValue';
			assert.deepEqual(json,this.json);
		});

		it('sets value on second level', function () {
			var json = utils.setJsonValue(['key1','key1key'],'key1.newValue',this.json);
			this.json.key1.key1key = 'newValue';
			assert.deepEqual(json,this.json);
		});

		it('sets value in array',function(){
			var json = utils.setJsonValue(['key2',0],'key2.newValue',this.json);
			this.json.key2[0] = 'key2.newValue';
			assert.deepEqual(json,this.json);
		});

		it('create key on first level',function(){
			var json = utils.setJsonValue(['NOT_EXIST'],'newValue',this.json);
			this.json.NOT_EXIST = 'newValue';
			assert.deepEqual(json,this.json);
		});

		it('create key on second level',function(){
			var json = utils.setJsonValue(['NOT_EXIST','NOT_EXIST'],'newValue',this.json);
			this.json.NOT_EXIST = {
				NOT_EXIST : 'newValue'
			};
			assert.deepEqual(json,this.json);
		});

		it('create key on third level',function(){
			var json = utils.setJsonValue(['NOT_EXIST','NOT_EXIST','NOT_EXIST'],'newValue',this.json);
			this.json.NOT_EXIST = {
				NOT_EXIST : {
					NOT_EXIST : 'newValue'
				}
			};
			assert.deepEqual(json,this.json);
		});

	});

});
