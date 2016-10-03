var generator2 = require('../../lib');
var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
	questions: function () {
		var self = this;
		return {
			base: {
				default: [
				],
				customizable : [
				]
			},
			module: {
				subgenerator: [
				]
			}
		}
	},

	default: function () {
	},
	customizable: function () {
	},
	subgenerator: function () {
	}

}).extend(generator2.subgenerator);
