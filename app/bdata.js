var BOARD_DATA = (function() {

  var lists = {};
  var meta = {};

  var _ = require('lodash');

  function getLists(dataLists, dataCards) {
    _.forEach(dataLists, function(value) {
      lists[value.id] = {
        name: value.name,
        cards: getCards(dataCards)
      };
    });
  }

  function getCards(dataCards) {
    var cards = [];
    _.forEach(dataCards, function(value) {
      var card = {
        name: value.name,
        url: value.url,
        desc: value.desc
      };
      if (card.desc !== '') {
        cards.push(card);
      }
    });
    return cards;
  }

  function getMeta(data) {
    meta = {
      name: data.name
    };
  }

  function process(data) {
    getLists(data.lists, data.cards);
    getMeta(data);
  }

  function pipeLists() {
    return lists;
  }

  function pipeMeta() {
    return meta;
  }

  return {
    pipeLists: pipeLists,
    pipeMeta: pipeMeta,
    process: process
  };

})();

module.exports = BOARD_DATA;
