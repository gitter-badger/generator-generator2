'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var Q = require('./prompt.json');

module.exports = yeoman.Base.extend({
  prompting: function () {
    var self = this;

    this.log(yosay(Q.yeosay));

    return this.prompt(Q.lang).then(function (A0) {
      var _self = this;
      _self.props = A0;

      return self.prompt(Q[A0.lang]).then(function (A1) {
        return _self.props.temp = A1.temp;
      }.bind(_self));

    }.bind(this));


  },

  writing: function () {

    this.log(this.props);
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  },

  install: function () {
    this.installDependencies();
  }
});
