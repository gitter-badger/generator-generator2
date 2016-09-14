'use strict';
var generator = require('yeoman-generator');
var questions = require('./questions');
var Helper = require('./helper');

module.exports = generator.Base.extend({

	initializing: function(){
		this.gen = new Helper(this);
		this.answeres = {};
	},

	prompting: function () {
		var self = this;

		if (!this.gen.isInited()) {

			this.gen.sayWelcome();

			return this.gen.initPrompt(
				questions.generator(),
				function(answeres){

					self.answeres = answeres;

                });

		} else {

			this.gen.sayWelcomeBack();

		}

	},
    configuring: function(){
		if(!this.gen.isInited()){
			this.gen.createYoRc(this.answeres);
		}
	},

	generator: function(){
		this.gen.callSubGenerator(
			this.gen.getYoRc('app.language')
		);
	},

	end: function(){

        this.gen.setYoRc('inited',true);
		this.gen.sayGoodBye();

	}
});


