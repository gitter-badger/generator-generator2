'use strict';

var questions = require('./questions');
var fs = require('fs');

var Helper = require('./helper');

exports.initializing = function () {
	this.gen = new Helper(this);
	this.answeres = {};
};

exports.prompting = function () {
	var self = this;

	var questionChoices = questions.subgenerator(
		this.gen.getBasesNames(),
		this.gen.getModulesNames()
	)[this.gen.isInited() ? 'module' : 'base'];

	return this.gen.postPrompt(
		questionChoices,
		function (answeres) {

			self.answeres = answeres;

		});

};

exports.configuring = function () {
	if (!this.gen.isInited())
		this.gen.setYoRcValue('subgenerator', this.answeres);
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
	this.gen.callSubGeneratorMethod(subGenMethod)
};
