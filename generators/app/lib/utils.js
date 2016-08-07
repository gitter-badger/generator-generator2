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

exports.decodeHtmlChars = function(string){
	return string
		.replace(/&#34;/g, '"')
		.replace(/&#39;/g, "'");
};
