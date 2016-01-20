/*jslint node: true */

'use strict';

var Promise = require('bluebird');
var writeFile = Promise.promisify(require('fs').writeFile);

// Write COntent to File
function file(data, path, ext) {
  return writeFile((path + '.' + ext), data);
}

exports.file = file;
