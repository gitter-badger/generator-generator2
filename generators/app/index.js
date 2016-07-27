'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var Q = require('./prompt.json');

module.exports = yeoman.Base.extend({
  prompting: function () {
    var self = this;

    this.log(yosay("Welcome to the delightful generator-generate generator!"));

    return this.prompt(Q.lang).then(function (A0) {
      self.props = A0;
      self.composeWith('generate:' + A0.lang);
    }.bind(this));
  }

});
