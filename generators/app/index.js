'use strict';
var generator = require('yeoman-generator');
var yosay = require('yosay');
var utils = require('./utils');
var fs = require('fs');
var Q = require('./prompt').generator();
var path = require('path');

module.exports = generator.Base.extend({
	prompting: function () {
		var self = this;

		if (!this.config.get('inited') && !this.config.get('app')) {

			this.log(yosay(Q.yosay));

			return this.prompt(Q.generator).then(function (A0) {
				return self.prompt(Q[A0.language]).then(function (A1) {

					self.props = {
						app: A0
					};
					self.props[A0.language] = A1;

					self._configuring();
					self._subgenerator();

				}.bind(self));
			}.bind(this));
		}

		this.log(yosay(this.config.get('app').authorName + " ♥ " + this.config.get('app').name));
		self._subgenerator();

	},

	_configuring: function () {
		var date = new Date();
		this.props.app.createdAt =  date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
		this.config.set(this.props);
		var yoRc = { "generator-generate" : this.config.getAll() };
		fs.writeFileSync(this.destinationPath('.yo-rc.json'),JSON.stringify(yoRc));
	},

	_subgenerator: function(){
		this.composeWith(
			'generate:' + this.config.get('app').language,
			{},
			{local:path.join(__dirname,'../java')});
	},

	end: function(){

		if(!this.config.get('inited'))
			this.config.set('inited',true);

		this.log('\n ♥ Yeoman loves you! ♥');
	}
});


