var path = require('path');

exports.getTestPath = function (folderName) {
	return path.join(__dirname, '../build/test', folderName);
};

exports.getGenPath = function(){
	return path.join(__dirname, '../generators/app');
};

exports.getPrompt = function (language, baseName) {
	var def = {
		name: "projectName",
		description: "Description generated from tests.",
		repoUrl: "https://github.com/urosjarc/projectName",
		siteUrl: "https://urosjarc.github.io/projectName",
		license: "MIT License",
		githubUser: "urosjarc",
		authorName: "Uros Jarc",
		versionEyeApiKey: "35bce4377c237824ed6e",

		language: language,
		base: baseName

		// "groupId": "com.github.urosjarc",
	};

	if (language == 'java') {
		def.groupId = "com.github.urosjarc";
	}

	return def;
};

exports.getText = function(array){
	return array.join(':');
};

exports.getConfig = function (language,baseName,inited) {
	var def = {
		app: {
			name: "projectName",
			description: "Description generated from tests.",
			repoUrl: "https://github.com/urosjarc/projectName",
			siteUrl: "https://urosjarc.github.io/projectName",
			license: "MIT License",
			githubUser: "urosjarc",
			authorName: "Uros Jarc",
			versionEyeApiKey: "35bce4377c237824ed6e",
			language: language,
			createdAt: '6/7/2016'
		},
		// java: {
		// 	groupId: 'com.github.urosjarc'
		// },
		subgenerator: {
			base: baseName
		},
		inited: inited
	};

	if(language == 'java'){
		def.java = {
			groupId : 'com.github.urosjarc'
		}
	}

	return def;
};
