var utils = require('generator-generate').utils;
var licenser = require('licenser');

/**
 * Module which holds prompt questions for user to answere.
 * @module questions
 */

/**
 * Questions for users on first time when generator run.
 * @returns {object} See inquirer npm package.
 */
exports.generator = function () {
	return {
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
				"name": "language",
				"message": "Select programming language:",
				"choices": [
					"java",
					"python",
					"javascript"
				]
			}
		],
		"java" : [
			{
				"type": "input",
				"name": "groupId",
				"message": "GroupId (com.github.username):"
			}
		]
	};
};

/**
 * Questions for users when generator is running the second time.
 * @param baseChoices {array<string>} Array of bases from template folder of subgenerator.
 * @param moduleChoices {array<string>} Array of modules from template folder of subgenerator.
 * @returns {object} See inquirer npm package.
 */
exports.subgenerator = function (baseChoices, moduleChoices) {
	return {
        "base": [
            {
                "type": "list",
                "name": "base",
                "message": "Select project base:",
                "choices": baseChoices
            }
        ],
        "module": [
            {
                "type": "list",
                "name": "module",
                "message": "Select module generator:",
                "choices": moduleChoices
            }
        ]
	};
};

