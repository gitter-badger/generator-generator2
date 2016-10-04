var generator2 = require('../../lib');
var generator = require('yeoman-generator');
var path = require('path');
var licenser = require('licenser.js');

var utils = generator2.utils;

module.exports = generator.Base.extend({

	questions: function () {
		var self = this;
		
		var gitName = self.user.git.name();
		var gitEmail = self.user.git.email();
		var appName = path.basename(this.destinationRoot());

		return [
			{
				"type": "input",
				"name": "name",
				"message": "Project name:",
				"default": appName,
				"validate": utils.validateWord
			},
			{
				"type": "input",
				"name": "description",
				"message": "Description:"
			},
			{
				"type": "input",
				"name": "homepage",
				"message": "Home page url:",
				"default": "https://" + gitName + ".github.io/" + appName,
				"validate": utils.validateUrl
			},
			{
				"type": "input",
				"name": "authorName",
				"message": "Authors real name:",
				"default": "Firstname Lastname"
			},
			{
				"type": "input",
				"name": "authorEmail",
				"message": "Authors email:",
				"default": gitEmail,
				"validate": utils.validateEmail
			},
			{
				"type": "input",
				"name": "authorUrl",
				"message": "Authors url:",
				"default": "https://github.com/" + gitName,
				"validate": utils.validateUrl
			},
			{
				"type": "input",
				"name": "repoUrl",
				"message": "Github repository url:",
				"default": "https://github.com/" + gitName + '/' + appName,
				"validate": utils.validateUrl
			},
			{
				"type": "input",
				"name": "githubUser",
				"message": "Github user:",
				"default": gitName,
				"validate": utils.validateWord
			},
			{
				"type": "input",
				"name": "twitterUser",
				"message": "Twitter user:",
				"filter" : function(input){
					if(!/^[a-zA-Z]/.test(input))
						return null;
					else return input;
				}
			},
			{
				"type": "input",
				"name": "patreonUser",
				"message": "Patreon user:",
				"filter" : function(input){
					if(!/^[a-zA-Z]/.test(input))
						return null;
					else return input;
				}
			},
		];
	}
}).extend(generator2.app);
