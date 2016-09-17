var fs = require('fs');
var chalk = require('chalk');
var yaml = require('js-yaml');
var mmm = require('mmmagic');
var ejs = require('ejs');
var process = require('process');

var magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);

exports.validateWord = function (input) {
	return /^[a-zA-Z._-]+$/.test(input) == true ? true : "Type single word with characters (A-Z a-z . - _)!";
};

/**
 * Src: https://gist.github.com/dperini/729294
 * @param input
 * @returns {*}
 */
exports.validateUrl = function (input) {
	var reWebUrl = new RegExp(
		"^" +
		// protocol identifier
		"(?:(?:https?|ftp)://)" +
		// user:pass authentication
		"(?:\\S+(?::\\S*)?@)?" +
		"(?:" +
		// IP address exclusion
		// private & local networks
		"(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
		"(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
		"(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
		// IP address dotted notation octets
		// excludes loopback network 0.0.0.0
		// excludes reserved space >= 224.0.0.0
		// excludes network & broacast addresses
		// (first & last IP address of each class)
		"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
		"(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
		"(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
		"|" +
		// host name
		"(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
		// domain name
		"(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
		// TLD identifier
		"(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
		// TLD may end with dot
		"\\.?" +
		")" +
		// port number
		"(?::\\d{2,5})?" +
		// resource path
		"(?:[/?#]\\S*)?" +
		"$", "i"
	);

	return reWebUrl.test(input) == true ? true : "Url should be (http://name.com/path)!"
};

exports.validateEmail = function (email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email) == true ? true : "Email is unvalid!";
};

exports.getAllFilesPaths = function getAllFilesPaths(dir) {
	var results = [];
	var list = fs.readdirSync(dir);
	list.forEach(function (file) {
		file = dir + '/' + file;
		var stat = fs.statSync(file);
		if (stat && stat.isDirectory()) results = results.concat(getAllFilesPaths(file));
		else results.push(file)
	});
	return results
};

exports.injectLines = function (filePath, lineFlag, injectArr) {
	var oldFileLines = fs.readFileSync(filePath, 'utf8').split('\n');
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
		return newFileLines.join('\n');
	}
};

exports.yamlToJson = function (path) {
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

exports.getNowDate = function () {
	var date = new Date();
	return date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
};

exports.getJsonValue = function (keyArr, json) {
	if (keyArr.length > 1) {
		var newJson = json[keyArr[0]];
		if (newJson instanceof Object) {
			return this.getJsonValue(keyArr.slice(1), newJson)
		} else {
			return undefined;
		}
	} else if (keyArr.length == 1) {
		return json[keyArr[0]];
	} else {
		return json;
	}
};

exports.setJsonValue = function (keyArr, value, json) {
	if (keyArr.length > 1) {
		var newJson = json[keyArr[0]] || {};
		if (newJson instanceof Object) {
			json[keyArr[0]] = this.setJsonValue(keyArr.slice(1), value, newJson);
			return json;
		}
	} else if (keyArr.length == 1) {
		json[keyArr[0]] = value;
		return json;
	}
};

exports.testGeneratorName = function (name) {

	var nameArr = name.split('-');

	return !(nameArr[0] != 'generator' || this.validateWord(nameArr[1]) != true);
};

exports.isEditable = function (filePath, callback) {

	try{
		if(!fs.lstatSync(filePath).isFile()){
			return callback(undefined,false);
		}
	} catch (err){
		return callback(err);
	}

	magic.detectFile(filePath, function (err, mimeType) {
		if (err) callback(err);

		var mimeTypeArr = mimeType.split('/');

		var mimeGroup = mimeTypeArr[0];
		var mimeFile = mimeTypeArr[1];

		if ([
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
		) callback(null,false);
		else {
			callback(null,true);
		}
	});
};

exports.ejsRender = function (filePath, config) {
	try {
		return ejs.render(
			fs.readFileSync(filePath, 'utf-8'),
			config
		);
	} catch (err) {
		throw new Error(chalk.red.bold(
			"\n > Message: " + err.message + '\n' +
			" > File: " + filePath + '\n'
		));
	}
};
