/*jslint node: true */

'use strict';

var fs = require('fs');
var _ = require('lodash');
var nunjucks = require('nunjucks');
var markdown = require('markdown').markdown;
var escapeHTML = require('escape-html');
var uncss = require('uncss');
var cssmin = require('cssmin');

var html;
var css;

var templates = {
  htmlTemplate: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>{{ title }}</title></head><body><h1>{{ title }}</h1>{{ lists }}</body></html>',
  listTemplate: '<section class="list"><h2>{{ listHeader }}</h2>{{ cards }}</section>',
  cardTemplate: '<article class="card"><h3><a href="{{ cardURL }}">{{ cardHeader }}</a></h3>{{ cardText }}</article>'
};

// HTML Lists
function htmlLists(lists) {
  var listsFragments = '';
  _.forEach(lists, function(value) {
    listsFragments += nunjucks.renderString(templates.listTemplate, {listHeader: value.name, cards: htmlCards(value.cards)});
  });
  return listsFragments;
}

// HTML Cards
function htmlCards(cards) {
  var cardsFragments = '';
  _.forEach(cards, function(value) {
    cardsFragments += nunjucks.renderString(templates.cardTemplate, {cardHeader: escapeHTML(value.name), cardURL: value.url, cardText: markdown.toHTML(value.desc)});
  });
  return cardsFragments;
}

// Process HTML
function processData(lists, meta, cssPath, userTemplates) {
  var styles = fs.readFileSync(cssPath, 'utf-8');
  nunjucks.configure({autoescape: false});
  if (userTemplates) {
    _.extend(templates, userTemplates);
  }
  html = nunjucks.renderString(templates.htmlTemplate, {title: meta.name, lists: htmlLists(lists)});
  return uncss(html, {raw: styles}, function(error, output) {
    var tag;
    css = cssmin(output);
    tag = `<style>${css}</style></head>`;
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
