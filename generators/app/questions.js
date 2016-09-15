var utils = require('./utils');
var licenser = require('licenser');

/**
 * Json configuration for main generator.
 *
 * @returns {{yosay: string, generator: *[]}}
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
				"type" : "input",
				"name" : "versionEyeApiKey",
				"message": "VersionEye api key (versioneye.com/settings/api): "
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
 * Json configuration for all subgenerators.
 *
 * @param baseChoices
 * @param moduleChoices
 * @returns {{subgenerator: {base: *[], module: *[]}}}
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

