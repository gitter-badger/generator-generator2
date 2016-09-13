var fs = require('fs');
var chalk = require('chalk');
var yaml = require('js-yaml');

exports.validateWord = function (input) {
	return /^[a-zA-Z.]+$/.test(input) == true ? true : "Use letters from a-z and A-Z with dot!";
};

exports.validateUrl = function (input) {
	return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(input) == true ? true : "Url is invalid!"
};

exports.validateEmail = function (email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email) == true ? true : "Email is unvalid!";
};

exports.walkSync = function walk(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(walk(file));
        else results.push(file)
    });
    return results
};

exports.yamlToJson = function(path){
	try {
		var doc = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
	} catch (err) {
		throw new Error(chalk.red.bold(
			"\n > Message: " + err.message + '\n' +
			" > File: " + path + '\n'
		));
	}

	return doc;
};

exports.getDate = function(){
	var date = new Date();
	return date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
};

exports.getJsonValue = function (keyArr,json){
	if(keyArr.length > 1){
		var newJson = json[keyArr[0]];
		if(newJson instanceof Object){
			return this.getJsonValue(keyArr.slice(1),newJson)
		} else {
			return undefined;
		}
	} else {
		return json[keyArr[0]];
	}
};

exports.setJsonValue = function(keyArr,value,json){
	if(keyArr.length > 1){
		var newJson = json[keyArr[0]];
		if(newJson instanceof Object){
			newJson = this.getJsonValue(keyArr.slice(1),newJson);
			return newJson;
		} else {
			throw new Error('Todo: Do this...');
		}
	} else {
		json[keyArr[0]] = value;
		return json;
	}
};

exports.validateAppName = function(name){

	var nameArr = name.split('-');

	if(
		nameArr[0] != 'generator' ||
		this.validateWord(nameArr[1]) != true
	){ throw new Error([
		'Generator app name failed to validate!',
		' > (generator-NAME) != ' + name
	].join('\n'))}
};
