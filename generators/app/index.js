'use strict';
var generator = require('yeoman-generator');
var questions = require('./questions');
var Helper = require('./helper');

module.exports = generator.Base.extend({

	constructor: function () {
		generator.Base.apply(this, arguments);
		this.option('debug', {
			desc : 'Debug generator to ./generator.debug file',
			type : Boolean,
			default : false
		});
	},

	initializing: function () {
		this.gen = new Helper(this);
		this.gen.registerEvents();
		this.answeres = {};
	},

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
	configuring: function () {
		this.gen.logger.info('Run context:','CONFIGURING');

		if (!this.gen.isGeneratorInited()) {
			this.gen.createYoRc(this.answeres);
		}
	},

	compose: function () {
		this.gen.logger.info('Run context:','COMPOSE');

		this.gen.callSubgenerator(
			this.gen.getYoRc('app.language')
		);
	},

	end: function () {
		this.gen.logger.info('Run context:','END');

		this.gen.setYoRc(true, 'inited');
		this.gen.sayGoodBye();
	}
});


