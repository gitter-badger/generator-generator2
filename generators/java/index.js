'use strict';

var yeoman = require('yeoman-generator');
var router = require('../app/router');

router.end = function(){
	this.log("Hello world!");
};

module.exports = yeoman.Base.extend(router);

