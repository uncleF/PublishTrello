/*jslint node: true */

'use strict';

var fs = require('fs');
var markdown = require('markdown').markdown;
var uncss = require('uncss');
var cssmin = require('cssmin');

var html;
var css;

// HTML Content form the MD
function htmlLists(md) {
  return markdown.toHTML(md);
}

// Final HTML Content
function htmlCards(data) {
  return data.replace(/(<h3>(?:.|\t|\n)*?)(?=(?:<h2>|<h3>|<\/body>))/g, '<article class="card" lang="en">$1</article>');
}

// Process HTML
function processData(md, meta, cssPath) {
  var styles = fs.readFileSync(cssPath, 'utf-8');
  html = htmlCards(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${meta.name}</title></head><body>${htmlLists(md)}</article></body></html>`);
  return uncss(html, {raw: styles}, function(error, output) {
    var tag;
    css = cssmin(output);
    tag = '<style>' + css + '</style></head>';
    html = html.replace('</head>', tag);
  });
}

// Pipe HTML
function pipe() {
  return html;
}

// Pipe HTML
function pipeCSS() {
  return css;
}

exports.processData = processData;
exports.pipe = pipe;
exports.pipeCSS = pipeCSS;
