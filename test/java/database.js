'use strict';

var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fun = require('../config');

describe('Java database subgen', function () {

	describe('CLI base',function(){
		before(function () {
			return helpers
				.run(fun.getGenPath())
				.withLocalConfig(fun.getConfig('java', 'CLI', true))
				.withPrompts({
					"module": "database"
				}).toPromise();
		});

		it('Creates default files',function(){
			assert.file([
				'src/main/java/app/db/Db.java'
			]);
		});
		
		it('Inject lines');
	});
});
