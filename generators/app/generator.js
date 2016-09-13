'use strict';

var questions = require('./questions');
var fs = require('fs');

var Helper = require('./helper');

exports.initializing = function () {
	this.gen = new Helper(this);
	this.answeres = {};
};

/**
 * Todo: Make filter of modules base on subgenerator.module
 */
exports.prompting = function () {
	var self = this;

	var questionChoices = questions.subgenerator(
		fs.readdirSync(self.templatePath('base')),
		fs.readdirSync(self.templatePath('module'))
	)[this.gen.isInited() ? 'module' : 'base'];

	return this.gen.postPrompt(
		questionChoices,
		function (answeres) {

			self.answeres = answeres;

		});

};

exports.configuring = function () {
	if (this.gen.isInited()) {
		var modules = this.gen.getYoRcValue('subgenerator.module');
		modules.push(this.answeres.module);
		this.gen.setYoRcValue( 'subgenerator.module', modules );
	} else {
		this.gen.setYoRcValue('subgenerator', this.answeres);
		this.gen.setYoRcValue('subgenerator.module', []);
	}
};

exports.writing = function () {
	var done = this.async();

	if (this.gen.isInited())
		this.gen.generateModule(this.answeres.module, done);
	else
		this.gen.generateBase(this.answeres.base, done);
};

exports.conflicts = function () {

	var subGenMethod = this.gen.isInited() ? this.answeres.module : this.answeres.base;

	this.gen.runLineInjector(subGenMethod);

	if (subGenMethod in this)
		this[subGenMethod]();

};
