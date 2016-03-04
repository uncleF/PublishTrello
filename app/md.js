/*jslint node: true */

'use strict';

var _ = require('lodash');

var md;

// MD Lists
function mdLists(lists) {
  var listsFragments = '';
  _.forEach(lists, function(value) {
    listsFragments += `## ${value.name}\n\n${mdCards(value.cards)}`;
  });
  return listsFragments;
}

// MD Cards
function mdCards(cards) {
  var cardsFragments = '';
  _.forEach(cards, function(value) {
    cardsFragments += `### [${value.name}](${value.url})\n\n${value.desc}\n\n`;
  });
  return cardsFragments;
}

// Process MD
function processData(lists, meta) {
  md = `# ${meta.name}\n\n${mdLists(lists)}`;
}

// Pipe MD
function pipe() {
  return md;
}

exports.processData = processData;
exports.pipe = pipe;
