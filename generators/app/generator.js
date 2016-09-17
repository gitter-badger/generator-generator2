'use strict';

var questions = require('./questions');
var fs = require('fs');

var Helper = require('./helper');

exports.initializing = function () {
	this.gen = new Helper(this);
	this.answeres = {};
};

exports.prompting = function () {
	this.gen.logger.info('Run context:','PROMTING');

	var self = this;

	var questionChoices = questions.subgenerator(
		this.gen.getBasesNames(),
		this.gen.getModulesNames()
	)[this.gen.isSubgeneratorInited() ? 'module' : 'base'];

	return this.gen.postPrompt(
		questionChoices,
		function (answeres) {

			self.answeres = answeres;

		});

};

exports.configuring = function () {
	this.gen.logger.info('Run context:','CONFIGURING');

	if (!this.gen.isSubgeneratorInited())
		this.gen.setYoRc(this.answeres,'subgenerator');
};

exports.writing = function () {
	this.gen.logger.info('Run context:','WRITING');

	var done = this.async();

	if (this.gen.isSubgeneratorInited())
		this.gen.generateModule(this.answeres.module, done);
	else
		this.gen.generateBase(this.answeres.base, done);
};

exports.conflicts = function () {
	this.gen.logger.info('Run context:','CONFLICTS');

	var subGenMethod = this.gen.isSubgeneratorInited() ? this.answeres.module : this.answeres.base;

	this.gen.runLineInjector(subGenMethod);
	this.gen.callSubgeneratorMethod(subGenMethod)
};
