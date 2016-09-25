var generate = require('generator-generate');
var yeoman = require('yeoman-generator');
var questions = require('./questions');
var path = require('path');

module.exports = yeoman.Base.extend({

    questions: questions.generator(),
    generators: path.join(__dirname, '..')

}).extend(generate.app);
