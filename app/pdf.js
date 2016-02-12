/*jslint node: true */

'use strict';

var Promise = require('bluebird');
var wkhtmltopdf = Promise.promisify(require('wkhtmltopdf'));

// Process PDF
function processData(html, path) {
  return wkhtmltopdf(html, {output: path + '.pdf'});
}

exports.processData = processData;
