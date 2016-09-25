var generate = require('generator-generate');
var yeoman = require('yeoman-generator');
var path = require('path');
var questions = require('../app/questions');

module.exports = yeoman.Base.extend({

    questions : questions.subgenerator(['CLI'],['database']),

    // constructor: function () {
    //     this.sourceRoot(path.join(__dirname,'templates'));
    // },

    /**
     * Generator shell method.
     */
    shell: function () {
    },

    /**
     * Generator javaFx method.
     */
    javaFx: function () {
    },

    /**
     * Generator CLI method.
     */
    CLI: function () {
    },


    /**
     * Generator database method.
     */
    database: function () {
    }

}).extend(generate.generator);
