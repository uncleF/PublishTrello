/*jslint node: true */

'use strict';

var _ = require('lodash');

var lists = {};
var meta = {};

// Get Lists
function getLists(data, options) {
  var processedLists = {};
  _.forEach(data.lists, function(value) {
    var id = value.id;
    var name = value.name;
    var cards;
    if (!options.exclude || options.exclude.indexOf(name) === -1) {
      cards = getCards(data.cards, id);
      if (cards.length > 0) {
        processedLists[id] = {
          name: name,
          cards: cards
        };
      }
    }
  });
  return processedLists;
}

// Get Cards for the List
function getCards(dataCards, listId) {
  var cards = [];
  _.forEach(dataCards, function(value) {
    var card;
    var desc = value.desc;
    if (desc !== '' && value.idList === listId) {
      card = {
        name: value.name,
        url: value.url,
        desc: desc
      };
      cards.push(card);
    }
  });
  return cards;
}

// Get Authors
function getAuthors(members) {
  return members.map(member => member.fullName).join(' ');
}

// Get Meta Data
function getMeta(data, options) {
  return {
    name: data.name,
    author: getAuthors(data.members)
  };
}

// Process Board Data
function processData(data, options) {
  lists = getLists(data, options);
  meta = getMeta(data, options);
}

// Pipe Lists
function pipeLists() {
  return lists;
}

// Pipe Meta Object
function pipeMeta() {
  return meta;
}

exports.pipeLists = pipeLists;
exports.pipeMeta = pipeMeta;
exports.processData = processData;
