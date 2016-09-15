var fs = require('fs');
var chalk = require('chalk');
var yaml = require('js-yaml');
var mmm = require('mmmagic');

var magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);

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

exports.getAllFilesPaths = function getAllFilesPaths(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(getAllFilesPaths(file));
        else results.push(file)
    });
    return results
};

exports.injectLines = function(filePath,lineFlag,injectArr,callback){
	var oldFileLines = fs.readFileSync(filePath,'utf8').split('\n');
	var newFileLines = [];
	var lineFlagFound = false;

	for (var i = 0; i < oldFileLines.length; i++) {
		newFileLines.push(oldFileLines[i]);

		if (oldFileLines[i].indexOf(lineFlag) != -1) {
			lineFlagFound = true;
			var whiteSpaces = '';
			for (var j = 0; j < oldFileLines[i].length; j++) {
				if (oldFileLines[i][j] == '\t' || oldFileLines[i][j] == ' ') {
					whiteSpaces += oldFileLines[i][j];
					continue;
				} else {
					break;
				}
			}
			newFileLines.push(whiteSpaces + injectArr.join('\n' + whiteSpaces));
		}
	}
	if (!lineFlagFound) {
		throw new ReferenceError(chalk.red.bold(
			"\n > Message: Line flag (" + lineFlag + ") not found!\n" +
			" > File: " + filePath + '\n'
		));
	} else {
		callback(newFileLines.join('\n'));
	}
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

exports.getNowDate = function(){
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
	} else if(keyArr.length == 1){
		return json[keyArr[0]];
	} else {
		return json;
	}
};

exports.setJsonValue = function(keyArr,value,json){
	if(keyArr.length > 1){
		var newJson = json[keyArr[0]] || {};
		if(newJson instanceof Object){
			json[keyArr[0]] = this.setJsonValue(keyArr.slice(1),value,newJson);
			return json;
		}
	} else if(keyArr.length == 1) {
		json[keyArr[0]] = value;
		return json;
	}
};

exports.validateGeneratorName = function(name){

	var nameArr = name.split('-');

	if(
		nameArr[0] != 'generator' ||
		this.validateWord(nameArr[1]) != true
	){ throw new Error([
		'Generator app name failed to validate!',
		' > (generator-NAME) != ' + name
	].join('\n'))}
};

exports.isEditable = function(filePath,callback){
	magic.detectFile(filePath, function (err, mimeType) {
		if (err) throw err;

		var mimeTypeArr = mimeType.split('/');
		if(mimeTypeArr.length != 2){
			throw new Error('Mime type unvalid: ' + mimeType);
		}

		var mimeGroup = mimeTypeArr[0];
		var mimeFile = mimeTypeArr[1];

        if(
            [
                'video',
                'audio',
                'image',
                'music',
                'x-music'
            ].indexOf(mimeGroup) != -1 ||
            [
                'pdf',
                'octet-stream'
            ].indexOf(mimeFile) != -1
        ) callback(false);
        else {
            callback(true);
        }
	});
};
