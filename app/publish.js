var PUBLISH_TRELLO = (function() {

  var json = require('./json');
  var bdata = require('./bdata');
  var md = require('./md');
  var html = require('./html');
  var pdf = require('./pdf');
  var epub = require('./epub');

  var q = require('q');
  var mdirp = require('mkdirp');

  var options;
  var link;
  var dir;
  var file;
  var css;
  var filePath;

  function init(initUrl, initDir, initOptions, initFile, initCSS) {
    link = initUrl;
    dir = initDir;
    options = initOptions ? initOptions : {md: true};
    file = initFile ? initFile : 'trelloBoard';
    css = initCSS ? initCSS : __dirname + '/css/styles.css';
    filePath = dir + '/' + file;
    getData();
  }

  function getData() {
    json.get(link, processData);
  }

  function processData(data) {
    var lists;
    var meta;
    bdata.process(data);
    lists = bdata.pipeLists();
    meta = bdata.pipeMeta();
    mdirp(dir);
    q.fcall(function() {
      outputMD(lists, meta);
    }).then(function() {
      var markdown = md.pipe();
      outputHTML(markdown, meta);
    }).then(function() {
      var promise = html.promise();
      if (promise) {
        promise.then(function() {
          outputRest(meta);
        });
      } else {
        outputRest(meta);
      }
    });
  }

  function outputMD(lists, meta) {
    if (options.md) {
      md.process(lists, meta, filePath, false);
    } else if (options.html || options.pdf || options.epub) {
      md.process(lists, meta, filePath, true);
    }
  }

  function outputHTML(markdown, meta) {
    if (options.html) {
      html.process(markdown, meta, css, filePath, false);
    } else if (options.pdf || options.epub) {
      html.process(markdown, meta, css, filePath, true);
    }
  }

  function outputPDF(content) {
    if (options.pdf) {
      pdf.process(content, filePath);
    }
  }

  function outputEPUB(content, meta) {
    if (options.epub) {
      epub.process(content, meta, filePath);
    }
  }

  function outputRest(meta) {
    var content = html.pipe();
    outputPDF(content);
    outputEPUB(content, meta);
  }

  return {
    init: init
  };

})();

module.exports = PUBLISH_TRELLO;
