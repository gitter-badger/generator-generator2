'use strict';

var assert = require('assert');
var yoAssert = require('yeoman-assert');
var Helper = require('../helper');

var helper = new Helper('java','CLI');

describe(helper.describe(), function () {

	before(function () {
		return helper.runGenerator();
	});

	it('Creates default files', function () {
		yoAssert.file([
			'.yo-rc.json',
			'LICENSE'
		]);
	});

	it('Creates base specific files', function () {
		yoAssert.file([
			'src/main/java/app/cmd'
		]);
	});

	it('Should have yo-rc.json content', function(){
		helper.assertContent('.yo-rc.json',[
			'"module": []'
		]);
	});

	describe('database subgenerator:',function(){

		before(function () {
			return helper.runSubgenerator('database');
		});

		it('Should have yo-rc.json content', function(){
			helper.assertContent('.yo-rc.json',[
                /"module":\s*\[\s*"database"\s*\]/
			]);
		});

		it('Creates default files',function(){
			yoAssert.file([
				'src/main/java/app/db/Db.java'
			]);
		});

		it('Injects build.gradle',function(){
			helper.assertContent('build.gradle',[
				/compile 'org.neo4j:neo4j-ogm-core:\S*'/,
				/compile 'org.neo4j:neo4j-ogm-core:\S*'/,
				/compile 'org.neo4j:neo4j-ogm-http-driver:\S*'/,
				/compile 'org.neo4j:neo4j-ogm-embedded-driver:\S*'/,
				/compile 'org.neo4j:neo4j-ogm-bolt-driver:\S*'/
			]);
		});
	});

});


