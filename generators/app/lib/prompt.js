var utils = require('./utils');

/**
 * Json configuration for main generator.
 *
 * @returns {{yosay: string, generator: *[]}}
 */
exports.generator = function () {
	return {
		"yosay": "♥ Java ♥\n♥ TypeScript ♥\n♥ Node ♥\n♥ Python ♥",
		"generator": [
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
				"type" : "input",
				"name" : "keywords",
				"message" : "Keywords:"
			},
			{
				"type": "input",
				"name": "homepage",
				"message": "Homepage (github):",
				"validate": utils.validateUrl
			},
			{
				"type": "list",
				"name": "license",
				"message": "License:",
				"choices": [
					"GNU AGPLv3",
					"GNU GPLv3",
					"GNU LGPLv3",
					"Mozilla Public License 2.0",
					"Apache License 2.0",
					"MIT License",
					"The Unlicense"
				]
			},
			{
				"type": "input",
				"name": "authorName",
				"message": "Authors name:"
			},
			{
				"type": "input",
				"name": "authorEmail",
				"message": "Author email:",
				"validate" : utils.validateEmail
			},
			{
				"type": "input",
				"name": "authorUrl",
				"message": "Author url:",
				"validate": utils.validateUrl
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
		]
	};
};

/**
 * Json configuration for all subgenerators.
 *
 * @param baseChoices
 * @param moduleChoices
 * @returns {{subgenerator: {base: *[], module: *[]}}}
 */
exports.subgenerator = function (baseChoices, moduleChoices) {
	return {
		"subgenerator": {
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
		}
	};
};
