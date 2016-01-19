var publish = require('./publish');

var options = {
	link: 'http://192.168.1.101:8000/data/board.json',
  dir: 'output',
  output: {
    md: true,
    html: true,
    pdf: true,
    epub: true
  }
};

publish.init(options);
