'use strict';
var generator = require('yeoman-generator');
var Helper = require('./helper');

exports.constructor = function () {
	generator.Base.apply(this, arguments);
	this.option('debug', {
		desc: 'Debug generator to ./generator.debug file',
		type: Boolean,
		default: false
	});
};

exports.initializing = function () {
	this.gen = new Helper(this);
	this.gen.registerProcessEvents();
	this.answeres = {};
};

exports.prompting = function () {
	this.gen.logger.info('Run context:', 'PROMTING');

	var self = this;

	if (!this.gen.isGeneratorInited()) {

		this.gen.sayWelcome();

		return this.gen.initPrompt(
			this.questions,
			function (answeres) {
				self.answeres = answeres;
			});

	} else {
		this.gen.sayWelcomeBack();
	}

};

exports.configuring = function () {
	this.gen.logger.info('Run context:', 'CONFIGURING');

	if (!this.gen.isGeneratorInited()) {
		this.gen.createYoRc(this.answeres);
	}
};

exports.compose = function () {
	this.gen.logger.info('Run context:', 'COMPOSE');

	this.gen.callSubgenerator(
		this.gen.getYoRc('app.language')
	);
};

exports.end = function () {
	this.gen.logger.info('Run context:', 'END');

	this.gen.setYoRc(true, 'inited');
	this.gen.sayGoodBye();
};
