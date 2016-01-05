var publish = require('./publish');

var options = {
	md: true,
	html: true,
	pdf: true,
	epub: true
};
var url = 'http://192.168.1.101:8000/data/board.json';
var dir = 'app/trelloBoards';
var file = 'trelloBoard';
var css = 'app/css/styles.css';

publish.init(options, url, dir, file, css);
