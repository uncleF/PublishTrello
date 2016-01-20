/*jslint node: true */

'use strict';

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

// Get the JSON Data
function get(link) {
  return request(link);
}

exports.get = get;
