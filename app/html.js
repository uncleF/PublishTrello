var HTML_DOCUMENT = (function() {

  var write = require('./write');

  var fs = require('fs');
  var markdown = require('markdown').markdown;
  var uncss = require('uncss');
  var cssmin = require('cssmin');

  var html;
  var styles;
  var template = {
    start: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>',
    middle: '</title></head><body>',
    end: '</article></body></html>'
  };

  var promise;

  function htmlLists(md) {
    html += markdown.toHTML(md);
  }

  function htmlCards() {
    html = html.replace(/(<h3>(?:.|\t|\n)*?)(?=(?:<h2>|<h3>|<\/body>))/g, '<article class="card" lang="en">$1</article>');
  }

  function htmlWrite(html, path, dry) {
    if (!dry) {
      write.file(html, path, 'html');
    }
  }

  function process(md, meta, css, path, dry) {
    html = template.start + meta.name + template.middle;
    htmlLists(md);
    htmlCards();
    html += template.end;
    if (css) {
      styles = fs.readFileSync(css, 'utf-8');
      promise = uncss(html, {raw: styles}, function(error, output) {
        var tag = '<style>' + cssmin(output) + '</style></head>';
        html = html.replace('</head>', tag);
        htmlWrite(html, path, dry);
      });
    } else {
      promise = false;
      htmlWrite(html, path, dry);
    }
  }

  function pipe() {
    return html;
  }

  function uncssPromise() {
    return promise;
  }

  return {
    process: process,
    pipe: pipe,
    promise: uncssPromise
  };

})();

module.exports = HTML_DOCUMENT;
