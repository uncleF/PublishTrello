var PUBLISH_TRELLO = (function() {

  var json = require('./json');
  var write = require('./write');
  var bdata = require('./bdata');
  var md = require('./md');
  var html = require('./html');
  var pdf = require('./pdf');
  var epub = require('./epub');

  var mdirp = require('mkdirp');
  var fstream = require('fstream');
  var tar = require('tar');
  var zlib = require('zlib');

  var options;

  function getData() {
    return json.get(options.link);
  }

  function prepareData(response) {
    bdata.process(JSON.parse(response));
    mdirp(options.dir);
  }

  function processMD() {
    md.process(bdata.pipeLists(), bdata.pipeMeta());
    if (options.output.md) {
      return write.file(md.pipe(), options.path, 'md');
    }
  }

  function processHTML(markdownContent) {
    if (options.output.html || options.output.pdf || options.output.epub) {
      return html.process(markdownContent, bdata.pipeMeta(), options.css);
    }
  }

  function writeHTML(htmlContent) {
    if (options.output.html) {
      return write.file(htmlContent, options.path, 'html');
    }
  }

  function processPDF(htmlContent) {
    if (options.output.pdf) {
      return pdf.process(htmlContent, options.path);
    }
  }

  function processEPUB(htmlContent) {
    if (options.output.epub) {
      return epub.process(htmlContent, bdata.pipeMeta(), options.path);
    }
  }

  function archiveOutput() {
    if (options.arch) {
      fstream.Reader({'path': options.dir + '/', 'type': 'Directory'}).pipe(tar.Pack()).pipe(zlib.Gzip()).pipe(fstream.Writer({'path': options.path + '.tar.gz'}));
    }
  }

  function publish() {
    getData().then(function(response) {
      prepareData(response);
    }).then(function() {
      processMD();
    }).then(function() {
      return processHTML(md.pipe());
    }).then(function() {
      var htmlContent = html.pipe();
      writeHTML(htmlContent);
      processPDF(htmlContent);
      processEPUB(htmlContent);
    }).then(function() {
      archiveOutput();
    }).catch(function(error) {
      console.log(error);
    }).done(function() {
      console.log('Done');
    });
  }

  function init(initOptions) {
    options = {
      link: initOptions.link,
      dir: initOptions.dir,
      file: initOptions.file ? initOptions.file : 'trelloBoard',
      css: initOptions.css ? initOptions.css : __dirname + '/css/styles.css',
      output: typeof initOptions.output === 'object' ? initOptions.output : {md: true},
      arch: initOptions.arch ? true : false
    };
    options.path = options.dir + '/' + options.file;
    publish();
  }

  return {
    init: init
  };

})();

module.exports = PUBLISH_TRELLO;
