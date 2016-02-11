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
var del = require('node-delete');
var mkdirp = require('mkdirp');
var archiver = require('archiver');

var options = {};

// Get JSON Data
function getData() {
  mkdirp(options.dir);
  return json.get(options.link);
}

// Process JSON Data
function prepareData(response) {
  bdata.processData(JSON.parse(response.body), options);
}

// Process MD
function processMD() {
  md.processData(bdata.pipeLists(), bdata.pipeMeta());
  return true;
}

// Write Processed MD to File
function writeMD() {
  if (options.output.md) {
    return write.file(md.pipe(), options.path, 'md');
  }
}

// Process HTML
function processHTML() {
  if (options.output.html || options.output.pdf || options.output.epub) {
    return html.processData(md.pipe(), bdata.pipeMeta(), options.css);
  }
  return false;
}

// Write Processed HTML to File
function writeHTML(htmlContent) {
  if (options.output.html) {
    return write.file(htmlContent, options.path, 'html');
  }
  return false;
}

// Process PDF and Write it to File
function processPDF(htmlContent) {
  if (options.output.pdf) {
    return pdf.processData(htmlContent, options.path);
  }
  return false;
}

// Process ePub and Write it to File
function processEPUB(htmlContent) {
  if (options.output.epub) {
    return epub.processData(htmlContent, html.pipeCSS(), bdata.pipeMeta(), options.path);
  }
  return false;
}

// Process MD and Write it to File
function writeAll() {
  del.sync([options.dir + '/*']);
  var htmlContent = html.pipe();
  return [
    writeMD(),
    writeHTML(htmlContent),
    processPDF(htmlContent),
    processEPUB(htmlContent)
  ];
}

// Archive Outputted Files
function archiveOutput(promises) {
  if (options.arch) {
    return Promise.all(promises).then(function() {
      return new Promise(function(resolve, reject) {
        var output;
        var archive;
        output = fs.createWriteStream(options.path + '.zip');
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

// Catch and Log an Error
function logError(error) {
  console.error(error);
}

// Done
function done() {
  console.log('Done');
}

// Process
function publish() {
  return new Promise(function(resolve, reject) {
    getData()
    .then(prepareData)
    .then(processMD)
    .then(processHTML)
    .then(writeAll)
    .then(archiveOutput)
    .catch(function(error) {
      logError(error);
      reject(options);
    })
    .done(function() {
      done();
      resolve(options);
    });
  });
}

// Initialization
function init(initOptions) {
  _.extend(options, initOptions);
  if (!Object.prototype.hasOwnProperty.call(options, 'file')) {
    options.file = 'trelloBoard';
  }
  if (!Object.prototype.hasOwnProperty.call(options, 'css')) {
    options.css = __dirname + '/css/styles.css';
  }
  if (!Object.prototype.hasOwnProperty.call(options, 'output')) {
    options.output = {md: true};
  }
  if (!Object.prototype.hasOwnProperty.call(options, 'author')) {
    options.author = 'Trello';
  }
  options.path = options.dir + '/' + options.file;
}

// Output
function output(initOptions) {
  init(initOptions);
  return publish();
}

exports.output = output;
