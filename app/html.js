/*jslint node: true */

'use strict';

var fs = require('fs');
var _ = require('lodash');
var nunjucks = require('nunjucks');
var markdown = require('markdown').markdown;
var escapeHTML = require('escape-html');
var uncss = require('uncss');
var cssmin = require('cssmin');

var html;
var css;

var templates = {
  htmlTemplate: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>{{ title }}</title></head><body><h1>{{ title }}</h1>{{ lists }}</body></html>',
  listTemplate: '<section class="list"><h2>{{ listHeader }}</h2>{{ cards }}</section>',
  cardTemplate: '<article class="card"><h3><a href="{{ cardURL }}">{{ cardHeader }}</a></h3>{{ cardText }}{{ cardAttachments.images }}{{ cardChecklists }}{{ cardAttachments.attachments }}{{ cardAttachments.links }}</article>',
  checklistTemplate: '<dl class="checklist"><dt>{{ checklistHeader }}</dt>{{ checklistItems }}</dl>',
  itemTemplate: '<dd>{{ checklistItem }}</dd>',
  itemCheckedTemplate: '<dd><strike>{{ checklistItem }}</strike></dd>',
  imageTemplate: '<img src={{ imageURL }} class="image">',
  attachmentsTemplate: '<dl class="attachments"><dt>{{ attachmentsHeader }}</dt>{{ attachmentsItems }}</dl>',
  attachmentTemplate: '<dd><a href="{{ attachmentURL }}">{{ attachmentItem }}</a></dd>',
};

// HTML Lists
function htmlLists(lists) {
  var listsFragments = '';
  _.forEach(lists, list => {
    var templateData = {
      listHeader: list.name,
      cards: htmlCards(list.cards)
    };
    listsFragments += nunjucks.renderString(templates.listTemplate, templateData);
  });
  return listsFragments;
}

function htmlAttachments(atachments) {
  var imagesFragments = '';
  var attachmentsFragments = '';
  var linksFragments = '';
  _.forEach(atachments, attachment => {
    var templateData;
    var template;
    if (attachment.previews.length > 0) {
      imagesFragments += nunjucks.renderString(templates.imageTemplate, {imageURL: attachment.url});
    } else {
      templateData = {
        attachmentURL: attachment.url,
        attachmentItem: attachment.name
      };
      template = nunjucks.renderString(templates.attachmentTemplate, templateData);
      if (attachment.bytes) {
        attachmentsFragments += template;
      } else {
        linksFragments += template;
      }
    }
  });
  return {
    images: imagesFragments,
    attachments: attachmentsFragments !== '' ? nunjucks.renderString(templates.attachmentsTemplate, {attachmentsHeader: 'Attachments', attachmentsItems: attachmentsFragments}) : '',
    links: linksFragments !== '' ? nunjucks.renderString(templates.attachmentsTemplate, {attachmentsHeader: 'Links', attachmentsItems: linksFragments}) : '',
  };
}

// HTML Attachments
function htmlChecklistItems(checklist) {
  var itemsFragments = '';
  _.forEach(checklist, item => {
    var template;
    if (item.state === 'incomplete') {
      template = templates.itemTemplate;
    } else {
      template = templates.itemCheckedTemplate;
    }
    itemsFragments += nunjucks.renderString(template, {checklistItem: item.name});
  });
  return itemsFragments;
}

// HTML Checklist
function htmlChecklist(checklists) {
  var checklistsFragments = '';
  _.forEach(checklists, checklist => {
    var templateData = {
      checklistHeader: checklist.name,
      checklistItems: htmlChecklistItems(checklist.checkItems)
    };
    checklistsFragments += nunjucks.renderString(templates.checklistTemplate, templateData);
  });
  return checklistsFragments;
}

// HTML Cards
function htmlCards(cards) {
  var cardsFragments = '';
  _.forEach(cards, card => {
    var templateData = {
      cardHeader: escapeHTML(card.name),
      cardURL: card.url,
      cardText: markdown.toHTML(card.desc),
      cardChecklists: card.checklists.length > 0 ? htmlChecklist(card.checklists) : '',
      cardAttachments: card.attachments.length > 0 ? htmlAttachments(card.attachments) : {images: '', attachments: '', links: ''}
    };
    cardsFragments += nunjucks.renderString(templates.cardTemplate, templateData);
  });
  return cardsFragments;
}

// Process HTML
function processData(lists, meta, cssPath, userTemplates) {
  var styles = fs.readFileSync(cssPath, 'utf-8');
  nunjucks.configure({autoescape: false});
  if (userTemplates) {
    _.extend(templates, userTemplates);
  }
  html = nunjucks.renderString(templates.htmlTemplate, {title: meta.name, lists: htmlLists(lists)});
  return uncss(html, {raw: styles}, function(error, output) {
    var tag;
    css = cssmin(output);
    tag = `<style>${css}</style></head>`;
    html = html.replace('</head>', tag);
  });
}

// Pipe HTML
function pipe() {
  return html;
}

// Pipe HTML
function pipeCSS() {
  return css;
}

exports.processData = processData;
exports.pipe = pipe;
exports.pipeCSS = pipeCSS;
