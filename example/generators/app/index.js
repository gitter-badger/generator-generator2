var generate = require('generator-generate');
var yeoman = require('yeoman-generator');
var path = require('path');
var licenser = require('licenser');

var utils = generate.utils;

module.exports = yeoman.Base.extend({

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
                "name": "language",
                "message": "Select programming language:",
                "choices": [
                    "java",
                    "python",
                    "javascript"
                ]
            }
        ],
        "java": [
            {
                "type": "input",
                "name": "groupId",
                "message": "GroupId (com.github.username):"
            }
        ]
    }

}).extend(generate.app);
