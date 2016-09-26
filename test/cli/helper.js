'use strict';

var path = require('path');
var yoTest = require('yeoman-test');
var fs = require('fs');

function Helper(subgenerator, baseName){
	this.subgenerator = subgenerator;
	this.baseName = baseName;

	this._prompt = {
		name: "NAME",
		description: "DESCRIPTION",
		repoUrl: "https://REPO_URL.com/",
		siteUrl: "https://SITE_URL.com/",
		license: "MIT License",
		githubUser: "GITHUB_USER",
		authorName: "AUTHOR_NAME",
		createdAt: 'CREATED_AT',
		subgenerator: subgenerator
	};

	this._config = {
		app: this._prompt,
		subgenerator: {
			base: baseName
		},
		inited : undefined
	};

	this._prompt.base = baseName;
}

var method = Helper.prototype;

method.runGenerator = function(){
	return yoTest
		.run(this.getPath())
		.inDir(this.getTestDir())
		.withPrompts(this.getPrompt())
		.toPromise();
};

method.assertContent = function(filePath,testArr){
	var content = fs.readFileSync(path.join(this.getTestDir(),filePath),'utf8');
	for(var i in testArr){
		if(testArr[i] instanceof RegExp){
			if(!testArr[i].test(content)){
				throw Error('Regex: "' + testArr[i] + '" failed on '+filePath);
			}
		} else if(content.indexOf(testArr[i]) == -1){
			throw Error('Line: "' + testArr[i] + '" is missing in '+filePath);
		}
	}
};

method.runSubgenerator = function(moduleName){
	return yoTest
		.run(this.getPath())
		.cd(this.getTestDir())
		.withLocalConfig(this.getConfig(true))
		.withPrompts({
			"module": moduleName
		}).toPromise();
};

method.getConfig = function (isInited) {
	var config = this._config;

	config.inited = isInited;

	return config;
};

method.getPath= function(){
	return path.join(__dirname, '../../generators/app');
};

method.describe = function(){
	return this.subgenerator
		+ ' ' + this.baseName + ':'
};

method.getTestDir = function(){
	return path.join(__dirname, '../../build',this.subgenerator,this.baseName);
};

method.getPrompt = function () {
	var prompt = this._prompt;

	return prompt;
};

module.exports = Helper;
