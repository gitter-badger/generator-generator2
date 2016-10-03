'use strict';

var fs = require('fs');
var Helper = require('./helper');

/**
 * Generator methods.
 * All subgenerators will inherite its methods.
 * @module generator
 */

/**
 * Initialize generator.
 * Setup helper and variables.
 */
exports.initializing = function () {
	this.gen = new Helper(this);
	this.answeres = {};
};

/**
 * Ask user questions.
 * For module or base, depending on yo-rc.json file.
 */
exports.prompting = function () {
	this.gen.logger.info('Run context:', 'PROMTING');

	var self = this;

	return this.gen.postPrompt(
		this.questions(),
		function (answeres) {
			self.answeres = answeres;
		});

};

/**
 * Save user answeres.
 * Save answeres to yo-rc.json file.
 */
exports.configuring = function () {
	this.gen.logger.info('Run context:', 'CONFIGURING');

	if (!this.gen.isSubgeneratorInited())
		this.gen.setYoRc(this.answeres.base, 'base');
	else
		this.gen.setYoRc(this.answeres.module, 'module');
};

/**
 * Create file arhitecture.
 */
exports.writing = function () {
	this.gen.logger.info('Run context:', 'WRITING');

	var done = this.async();

	if (this.gen.isSubgeneratorInited())
		this.gen.generateModule(this.answeres.module.name, done);
	else
		this.gen.generateBase(this.answeres.base.name, done);
};

/**
 * Inject and call method.
 * Methods must be defined in subgenerator.
 */
exports.conflicts = function () {
	this.gen.logger.info('Run context:', 'CONFLICTS');

	var subGenMethod = this.gen.isSubgeneratorInited() ? this.answeres.module.name : this.answeres.base.name;

	this.gen.runLineInjector(subGenMethod);
	this.gen.callSubgeneratorMethod(subGenMethod)
};