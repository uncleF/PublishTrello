var EPUB_DOCUMENT = (function() {

  var _ = require('lodash');
  var Epub = require('epub-gen');

  function epubLists(html) {
    var result = [];
    var contentArray;
    html = html
      .replace(/<!DOCTYPE html>.*<\/h1>/gi, '')
      .replace('</body></html>', '');
    contentArray = html.split('<h2>');
    contentArray.shift();
    _.forEach(contentArray, function(value, index) {
      var components = value.split('</h2>');
      result[index] = {
        title: components[0],
        data: components[1]
      };
    });
    return result;
  }

  function process(html, meta, path) {
    var options = {
      title: meta.name,
      author: 'Me',
      content: epubLists(html)
    };
    new Epub(options, path + '.epub');
  }

  return {
    process: process
  };

})();

module.exports = EPUB_DOCUMENT;
