/*jslint node: true */

'use strict';

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

// Parse Response into JSON
function parseJSON(response) {
  return JSON.parse(response.body);
}

// Get the JSON Data
function get(options) {
  var link = `${options.url}.json?fields=name,desc&lists=open&list_fields=name&cards=visible&card_checklists=all&card_attachments=true&members=owners&key=${options.key}&token=${options.token}`;
  return request(link).then(parseJSON);
}

exports.get = get;
