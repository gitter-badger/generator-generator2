module.exports = {
	"subgenerator": [
		{
			"type": "input",
			"name": "projectName",
			"message": "Project name:",
			"validate" : function (input) {
				return /^[a-zA-Z]+$/.test(input) == true ? true : "Use letters from a-z and A-Z!";
			}
		},
		{
			"type": "input",
			"name": "projectInfo",
			"message": "Project info:"
		},
		{
			"type": "input",
			"name": "githubUser",
			"message": "Github username:",
			"validate" : function (input) {
				return /^[a-zA-Z]+$/.test(input) == true ? true : "Use letters from a-z and A-Z!";
			}
		},
		{
			"type": "list",
			"name": "subgenerator",
			"message": "Select programming language:",
			"choices": [
				"java",
				"python",
				"javascript"
			]
		}
	]
};
