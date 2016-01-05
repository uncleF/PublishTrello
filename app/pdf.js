var PDF_DOCUMENT = (function() {

  var wkhtmltopdf = require('wkhtmltopdf');

  function process(html, path) {
    wkhtmltopdf(html, {output: path + '.pdf'});
  }

  return {
    process: process
  };

})();

module.exports = PDF_DOCUMENT;
