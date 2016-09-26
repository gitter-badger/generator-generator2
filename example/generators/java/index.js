var generate = require('generator-generate');
var yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({

    questions : {
        "base": [
            {
                "type": "list",
                "name": "base",
                "message": "Select project base:",
                "choices": [
                    'CLI'
                ]
            }
        ],
        "module": [
            {
                "type": "list",
                "name": "module",
                "message": "Select module generator:",
                "choices": [
                    'database'
                ]
            }
        ]
    },

    shell: function () {
    },

    javaFx: function () {
    },

    CLI: function () {
    },

    database: function () {
    }

}).extend(generate.generator);
