'use strict';

var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

/**
 * Get license file path or directory.
 *
 * @param name {String}
 */
function licensesPath(name) {
	return path.join(__dirname, 'licenses', name || '.');
}

/**
 * Get licenses names.
 *
 * @returns {Array<String>}
 */
exports.getNames = function () {
	return fs.readdirSync(licensesPath());
};

/**
 * Get license file content.
 *
 * @param licenseName {String}
 * @param year {String}
 * @param author {String
 * @returns {String}
 */
exports.getContent = function (licenseName, year, author) {
	var licenseContent = fs.readFileSync(licensesPath(licenseName), 'utf-8');
	return ejs.render(
		licenseContent, {
			year: year,
			author: author
		}
	);
};
