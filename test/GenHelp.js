'use strict';

var path = require('path');
var yoTest = require('yeoman-test');
var fse = require('fs-extra');

function GenHelp(language,baseName){
	this.language = language;
	this.baseName = baseName;

	this._prompt = {
		name: "NAME",
		description: "DESCRIPTION",
		repoUrl: "https://REPO_URL.com/",
		siteUrl: "https://SITE_URL.com/",
		license: "MIT License",
		githubUser: "GITHUB_USER",
		authorName: "AUTHOR_NAME",
		versionEyeApiKey: "VERSION_EYE_API_KEY",
		createdAt: 'CREATED_AT',
		language: language
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

GenHelp.prototype.runGenerator = function(){
	if(this.getTestDir().indexOf('/generator-generate/build/') == -1)
		throw new Error( 'Test dir('+this.getTestDir()+') not in /generator-generate/build/');
	fse.removeSync(this.getTestDir());
	return yoTest
		.run(this.getPath())
		.inDir(this.getTestDir())
		.withPrompts(this.getPrompt())
		.toPromise();
};

GenHelp.prototype.runSubgenerator = function(moduleName){
	return yoTest
		.run(this.getPath())
		.inDirKeep(this.getTestDir())
		.withLocalConfig(this.getConfig(true))
		.withPrompts({
			"module": moduleName
		}).toPromise();
};

GenHelp.prototype.getConfig = function (isInited) {
	var config = this._config;

	config.inited = isInited;

	if(this.language == 'java'){
		config.java = {
			groupId : 'GROUP_ID'
		}
	}

	return config;
};

GenHelp.prototype.getPath= function(){
	return path.join(__dirname, '../generators/app');
};

GenHelp.prototype.describe = function(){
	return this.language
		+ ' ' + this.baseName + ' generator:'
};

GenHelp.prototype.getTestDir = function(){
	return path.join(__dirname, '../build',this.language,this.baseName);
};

GenHelp.prototype.getPrompt = function () {
	var prompt = this._prompt;

	if (this.language == 'java')
		prompt.groupId = "GROUP_ID";

	return prompt;
};

module.exports = GenHelp;
