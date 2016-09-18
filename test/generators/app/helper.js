var assert = require('assert');
var path = require('path');
var fs = require('fs');
var sinon = require('sinon');
var generator = require('../../data/helper/generator-simple');
var Helper = require('../../../generators/app/helper');

describe('Helper', function () {

	beforeEach(function(){
		console.log(generator);
		this.helper = new Helper(new generator.Base());
	});

	describe('constructor',function(){
		it('sets #gen property',function(){
			// assert.equal(typeof this.helper,'Helper');
		});
	});
});
