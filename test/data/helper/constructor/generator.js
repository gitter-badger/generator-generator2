var generator = require('yeoman-generator');
var Helper = require('../../../../generators/app/helper');

module.exports = generator.Base.extend({
	constructor: function () {
		generator.Base.apply(this, arguments);
		this.option('debug', {
			desc: 'Debug generator to ./generator.debug file',
			type: Boolean,
			default: false
		});
	}
});
