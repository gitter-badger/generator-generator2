var generator2 = require('../../lib');
var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
	questions: function () {
		var self = this;
		return {
			base: {
				default: [
					{
                        "type": "input",
                        "name": "testing",
                        "message": "Testing default question..."
                    }
				],
				customizable : [
					{
                        "type": "input",
                        "name": "testing",
                        "message": "Testing customizable question..."
                    }
				]
			},
			module: {
				subgenerator: [
					{
                        "type": "input",
                        "name": "testing",
                        "message": "Testing subgenerator question..."
                    }
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
