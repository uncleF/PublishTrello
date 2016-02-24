/*jslint node: true */

'use strict';

var publish = require('./publish');

var qconf = require('qconf');

var config = qconf();

var API_KEY = config.get('key');
var TOKEN = config.get('token');

var options = {
  url: 'https://trello.com/b/BPadvEsr',
  dir: 'output',
  output: {
    md: true,
    html: true,
    pdf: true,
    epub: true
  },
  arch: true,
  exclude: ['Links'],
  key: API_KEY,
  token: TOKEN
};

publish.output(options);
