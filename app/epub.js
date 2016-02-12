/*jslint node: true */

'use strict';

var _ = require('lodash');
var Epub = require('epub-gen');

// Get ePub Content
function epubLists(html) {
  var content = [];
  var contentArray;
  html = html
    .replace(/<!DOCTYPE html>.*<\/h1>/gi, '')
    .replace('</body></html>', '');
  contentArray = html.split('<h2>');
  contentArray.shift();
  _.forEach(contentArray, function(value, index) {
    var components = value.split('</h2>');
    content[index] = {
      title: components[0],
      data: components[1]
    };
  });
  return content;
}

// Process EPub
function processData(html, css, meta, path) {
  var options = {
    title: meta.name,
    author: meta.author,
    content: epubLists(html),
    css: css
  };
  return new Epub(options, path + '.epub').promise;
}

exports.processData = processData;
