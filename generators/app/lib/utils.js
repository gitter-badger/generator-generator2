var ejsRender = require('ejs').render;
var walk = require('walk');
var pathJoin = require('path').join;

exports.walkWithEjs = function(fromDir,toDir,config,onFile,done){
	var walker = walk.walk(fromDir);
	walker.on("file", function (root, stat, next) {
		var from = pathJoin(root, stat.name);
		var to = ejsRender(from.replace(fromDir, toDir),config);
		onFile(from,to);
		next();
	});

	walker.on('end',function(){
		done();
	});
};
