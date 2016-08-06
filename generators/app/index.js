'use strict';
var generator = require('yeoman-generator');
var yosay = require('yosay');
var utils = require('./lib/utils');
var fs = require('fs');
var Q = require('./lib/prompt').generator();

module.exports = generator.Base.extend({
	prompting: function () {
		var self = this;

		if(!this.config.get('inited') && !this.config.get('app')){
			this.log(yosay(Q.yosay));
			return this.prompt(Q.generator).then(function (A0) {
				self.props = {
					app: A0
				};
				self._configuring();
				self._subgenerator();
			}.bind(this));
		}

		self._subgenerator();

	},

	_configuring: function () {
		this.config.set(this.props);
		var yoRc = { "generator-generate" : this.config.getAll() };
		fs.writeFileSync(this.destinationPath('.yo-rc.json'),JSON.stringify(yoRc));
	},

	_subgenerator: function(){
		this.composeWith('generate:' + this.config.get('app').language);
	},

	end: function(){

		if(!this.config.get('inited'))
			this.config.set('inited',true);

		this.log('\n ♥ Yeoman has finish...');
	}
});


