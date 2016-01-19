var MD_DOCUMENT = (function() {

  var md;

  var _ = require('lodash');

  function mdLists(lists) {
    var listsFragments = '';
    _.forEach(lists, function(value) {
      listsFragments += '## ' + value.name + '\n\n' + mdCards(value.cards);
    });
    return listsFragments;
  }

  function mdCards(cards) {
    var cardsFragments = '';
    _.forEach(cards, function(value) {
      cardsFragments += '### ' + '[' + value.name + '](' + value.url + ')' + '\n\n' + value.desc + '\n\n';
    });
    return cardsFragments;
  }

  function process(lists, meta) {
    md = '# ' + meta.name + '\n\n' + mdLists(lists);
  }

  function pipe() {
    return md;
  }

  return {
    process: process,
    pipe: pipe
  };

})();

module.exports = MD_DOCUMENT;
