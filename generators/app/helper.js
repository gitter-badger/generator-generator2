var yosay = require('yosay');
var questions = require('./questions');
var utils = require('./utils');
var pathJoin = require('path').join;
var pac = require('../../package.json');
var fs = require('fs');

function Helper(generator){
	this.gen = generator;

	utils.validateAppName(pac.name);

	this.appName = pac.name;
	this.genName = pac.name.split('-')[1];

}

var method = Helper.prototype;

method.isInited = function(){
	return !this.gen.config.get('inited') && !this.gen.config.get('app');
};

method.initPrompt = function(callback){

	var self = this;
	var genQuestions = questions.generator();

	return this.gen.prompt(genQuestions.app).then(function (appAnswers) {
		var appLang = appAnswers.language;
		return self.gen.prompt(genQuestions[appLang]).then(function (langAnswers) {

			var answeres = { app: appAnswers };
			answeres[appLang] = langAnswers;

			callback(answeres);

		}.bind(self.gen));
	}.bind(this.gen));

};

method.createYoRc = function(json){
	var yoRc = {};

	json.app.createdAt = utils.getDate();
	this.gen.config.set(json);

	yoRc[this.appName] = json;

	fs.writeFileSync(
		this.gen.destinationPath('.yo-rc.json'),
		JSON.stringify(yoRc, null, 4)
	);
};

method.callSubGenerator = function(subGenerator){
	this.gen.composeWith(
		this.genName + ':' + subGenerator, {}, {
			local: pathJoin(__dirname, '..',subGenerator)
		}
	);
};

method.getYoRcValue = function (keys){
    return utils.getJsonValue(
        keys.split('.'),
        this.gen.config.getAll()
    );
};

method.setYoRcValue = function(keys,value){
	var newJson = utils.setJsonValue(
		keys.split('.'),
		value,
		this.gen.config.getAll()
	);

};

method.sayWelcome = function(){
	this.gen.log(yosay([
		"♥ Java ♥",
		"♥ TypeScript ♥",
		"♥ Node ♥",
		"♥ Python ♥"
	].join('\n')));
};
method.sayWelcomeBack = function(){
	this.gen.log(yosay([
		this.gen.config.get('app').authorName,
		"♥",
		this.gen.config.get('app').name
	].join(' ')));
};

method.sayGoodBye = function(){
	this.gen.log([
		'',
		' ♥ Yeoman loves you! ♥'
	].join('\n'));
};

module.exports = Helper;
