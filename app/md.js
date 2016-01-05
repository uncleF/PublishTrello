var MD_DOCUMENT = (function() {

  var md;

  var write = require('./write');

  var _ = require('lodash');

  function mdLists(lists) {
    _.forEach(lists, function(value) {
      md += '## ' + value.name + '\n\n';
      mdCards(value.cards);
    });
  }

  function mdCards(cards) {
    _.forEach(cards, function(value) {
      md += '### ' + '[' + value.name + '](' + value.url + ')' + '\n\n' + value.desc + '\n\n';
    });
  }

  function process(lists, meta, path, dry) {
    md = '# ' + meta.name + '\n\n';
    mdLists(lists);
    if (!dry) {
      write.file(md, path, 'md');
    }
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
