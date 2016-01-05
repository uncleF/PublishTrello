var publish = require('./publish');

var options = {
	md: true,
	html: true,
	pdf: true,
	epub: true
};
var dataURL = 'http://192.168.1.101:8000/data/board.json';

publish.init(options, dataURL);
