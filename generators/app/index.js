'use strict';
var generator = require('yeoman-generator');
var questions = require('./questions');
var Helper = require('./helper');

/**
 * Main subgenerator with extended inner methods.
 * @module app
 */

/**
 * @type {yeoman-generator.Base.extend({})}
 */
module.exports = generator.Base.extend({

	/**
	 * Constructor method with added cli options.
	 * Set debug options which starts logger to be loud.
	 */
	constructor: function () {
		generator.Base.apply(this, arguments);
		this.option('debug', {
			desc : 'Debug generator to ./generator.debug file',
			type : Boolean,
			default : false
		});
	},

	/**
	 * Initialize helper and register helper events.
	 * Also init answeres property.
	 */
	initializing: function () {
		this.gen = new Helper(this);
		this.gen.registerProcessEvents();
		this.answeres = {};
	},

	/**
	 * Prompt user for the first time. And set answer property.
	 */
	prompting: function () {
		this.gen.logger.info('Run context:','PROMTING');

		var self = this;

		if (!this.gen.isGeneratorInited()) {

			this.gen.sayWelcome();

			return this.gen.initPrompt(
				questions.generator(),
				function (answeres) {
					self.answeres = answeres;
				});

		} else {
			this.gen.sayWelcomeBack();
		}

	},

	/**
	 * Set `yo-rc.json` values.
	 */
	configuring: function () {
		this.gen.logger.info('Run context:','CONFIGURING');

		if (!this.gen.isGeneratorInited()) {
			this.gen.createYoRc(this.answeres);
		}
	},

	/**
	 * Call subgenerator.
	 */
	compose: function () {
		this.gen.logger.info('Run context:','COMPOSE');

		this.gen.callSubgenerator(
			this.gen.getYoRc('app.language')
		);
	},

	/**
	 * Init end procedure.
	 */
	end: function () {
		this.gen.logger.info('Run context:','END');

		this.gen.setYoRc(true, 'inited');
		this.gen.sayGoodBye();
	}
});


