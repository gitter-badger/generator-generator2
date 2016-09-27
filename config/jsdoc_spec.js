var path = require('path');
var fs = require('fs');

exports.handlers = {
	newDoclet: function (e) {
		var meta = e.doclet.meta;
		var description = e.doclet.description;

		var sourceString = '';
		var sourceLines = [];
		var commentsArr = [];

		if (typeof description === 'string') {

			//Set sourceString
			var fileContent = fs.readFileSync(
				path.join(meta.path, meta.filename),
				'utf-8'
			);

			//Set sourceLines
			for (var i = meta.range[0]; i < meta.range[1]; i++) {
				sourceString += fileContent[i];
			}
			sourceLines = sourceString.split('\n');

			//Set commentsArr
			for(var i in sourceLines){
				if(sourceLines[i].indexOf('//') != -1) {
					commentsArr.push(sourceLines[i].split('//')[1]);
				}
			}

			//Set new description if commentsArr is full
			if(commentsArr.length > 0){
				e.doclet.description += '<b>Specs:</b><ol>';
				for(var i in commentsArr){
					e.doclet.description += '<li>' + commentsArr[i] + '</li>\n';
				}
				e.doclet.description += '</ol>';
			}
		}
	}
};
