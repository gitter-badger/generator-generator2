var generator2 = require('../../lib');
var generator = require('yeoman-generator');
var path = require('path');
var licenser = require('licenser.js');

var utils = generator2.utils;

module.exports = generator.Base.extend({

	questions: {
		"app": [
			{
				"type": "input",
				"name": "name",
				"message": "Project name:",
				"validate": utils.validateWord
			},
			{
				"type": "input",
				"name": "description",
				"message": "Description:"
			},
			{
				"type": "input",
				"name": "repoUrl",
				"message": "Repository url (https://github.com/USER/PROJECT):",
				"validate": utils.validateUrl
			},
			{
				"type": "input",
				"name": "siteUrl",
				"message": "Site url (https://USER.github.io/PROJECT):",
				"validate": utils.validateUrl
			},
			{
				"type": "list",
				"name": "license",
				"message": "License:",
				"choices": licenser.getNames()
			},
			{
				"type": "input",
				"name": "githubUser",
				"message": "Github user:"
			},
			{
				"type": "input",
				"name": "authorName",
				"message": "Authors name:"
			},
			{
				"type": "list",
				"name": "subgenerator",
				"message": "Select subgenerator:",
				"choices": [
					"generator"
				]
			}
		],
		"generator": []
	}

}).extend(generator2.app);
