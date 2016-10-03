'use strict';

var fs =  require('fs');
var path = require('path');
var ejs = require('ejs');

function licensesPath(name){
	return path.join(__dirname,'licenses',name || '.');
}

exports.getNames = function(){
	return fs.readdirSync(licensesPath());
};

exports.getContent = function(licenseName,ejsConfig){
	var licenseContent = fs.readFileSync(licensesPath(licenseName),'utf-8');
	if(ejsConfig)
        return ejs.render(
            licenseContent,
            ejsConfig
        );
	else
		return licenseContent;
};
