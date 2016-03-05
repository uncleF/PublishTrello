/*jslint node: true */

'use strict';

var json = require('./json');
var write = require('./write');
var bdata = require('./bdata');
var md = require('./md');
var html = require('./html');
var pdf = require('./pdf');
var epub = require('./epub');

var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');
var mkdirp = require('mkdirp');
var archiver = require('archiver');
var chalk = require('chalk');

function output(initOptions) {

  var options = {
    output: {
      md: true,
      html: true,
      pdf: true,
      epub: true
    },
    arch: true,
  };

  // Get JSON Data
  function getData() {
    mkdirp(options.dir);
    return json.get(options);
  }

  // Process JSON Data
  function prepareData(data) {
    bdata.processData(data, options);
  }

  // Get Correct Filename
  function getFilename(file) {
    file = file.replace(/[^a-zA-Z0-9\-]([a-zA-Z0-9\-]{1}|)/g, function(value) { return value.replace(/[^a-zA-Z0-9\-]/g, '').toUpperCase(); });
    return file.length > 150 ? file.substring(0, 150) : file;
  }

  // Result Path
  function getFilePath() {
    if (!Object.prototype.hasOwnProperty.call(options, 'file')) {
      options.file = getFilename(bdata.pipeMeta().name);
      options.path = `${options.dir}/${options.file}`;
    }
    return true;
  }

  // Process MD
  function processMD() {
    if (options.output.md) {
      md.processData(bdata.pipeLists(), bdata.pipeMeta());
    }
    return true;
  }

  // Write MD to File
  function writeMD() {
    if (options.output.md) {
      return write.file(md.pipe(), options.path, 'md');
    }
    return true;
  }

  // Process HTML
  function processHTML() {
    if (options.output.html || options.output.pdf || options.output.epub) {
      return html.processData(bdata.pipeLists(), bdata.pipeMeta(), options.css);
    }
    return false;
  }

  // Write HTML to File
  function writeHTML(htmlContent) {
    if (options.output.html) {
      return write.file(htmlContent, options.path, 'html');
    }
    return false;
  }

  // Process PDF
  function processPDF(htmlContent) {
    if (options.output.pdf) {
      return pdf.processData(htmlContent, options.path);
    }
    return false;
  }

  // Process ePub
  function processEPUB(htmlContent) {
    if (options.output.epub) {
      return epub.processData(htmlContent, html.pipeCSS(), bdata.pipeMeta(), options.path);
    }
    return false;
  }

  // Write Everything
  function writeAll() {
    var htmlContent = html.pipe();
    return [
      writeMD(),
      writeHTML(htmlContent),
      processPDF(htmlContent),
      processEPUB(htmlContent)
    ];
  }

  // Archive Output
  function archiveOutput(promises) {
    if (options.arch) {
      return Promise.all(promises).then(function() {
        return new Promise(function(resolve, reject) {
          var output;
          var archive;
          output = fs.createWriteStream(`${options.path}.zip`);
          output.on('close', function() {
            resolve();
          });
          archive = archiver('zip');
          archive.bulk([{
            expand: true,
            cwd: options.dir,
            src: ['*.*', '!*.zip'],
            dest: './'
          }]);
          archive.pipe(output);
          archive.finalize();
        });
      });
    }
    return false;
  }

  // Done
  function done() {
    console.log(chalk.green('✔ Done\n'));
  }

  // Process
  function publish() {
    return new Promise(function(resolve, reject) {
      getData()
        .then(prepareData)
        .then(getFilePath)
        .then(processMD)
        .then(processHTML)
        .then(writeAll)
        .then(archiveOutput)
        .then(function() {
          done();
          resolve(options);
        })
        .catch(reject);
    });
  }

  // Initialization
  function init() {
    _.extend(options, initOptions);
    if (!Object.prototype.hasOwnProperty.call(options, 'css')) {
      options.css = __dirname + '/css/styles.css';
    }
    if (!Object.prototype.hasOwnProperty.call(options, 'output')) {
      options.output = {md: true};
    }
  }

  init();
  return publish();

}

exports.output = output;
