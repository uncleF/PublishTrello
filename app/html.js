var HTML_DOCUMENT = (function() {

  var fs = require('fs');
  var markdown = require('markdown').markdown;
  var uncss = require('uncss');
  var cssmin = require('cssmin');

  var html;
  var template = {
    start: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>',
    middle: '</title></head><body>',
    end: '</article></body></html>'
  };

  function htmlLists(md) {
    return markdown.toHTML(md);
  }

  function htmlCards(data) {
    return data.replace(/(<h3>(?:.|\t|\n)*?)(?=(?:<h2>|<h3>|<\/body>))/g, '<article class="card" lang="en">$1</article>');
  }

  function process(md, meta, css) {
    var styles = fs.readFileSync(css, 'utf-8');
    html = htmlCards(template.start + meta.name + template.middle + htmlLists(md)) + template.end;
    return uncss(html, {raw: styles}, function(error, output) {
      var tag = '<style>' + cssmin(output) + '</style></head>';
      html = html.replace('</head>', tag);
    });
  }

  function pipe() {
    return html;
  }

  return {
    process: process,
    pipe: pipe
  };

})();

module.exports = HTML_DOCUMENT;
