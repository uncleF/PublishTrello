/*jslint node: true */

'use strict';

var _ = require('lodash');

var md;

// MD Lists
function mdLists(lists) {
  var listsFragments = '';
  _.forEach(lists, value => {
    listsFragments += `## ${value.name}\n\n${mdCards(value.cards)}`;
  });
  return listsFragments;
}

// MD Attachments
function mdAttachments(atachments) {
  var imagesFragments = '';
  var attachmentsFragments = '';
  var linksFragments = '';
  _.forEach(atachments, attachment => {
    var template;
    if (attachment.previews.length > 0) {
      imagesFragments += `![${attachment.name}](${attachment.url})\n\n`;
    } else {
      template = `- [${attachment.name}](${attachment.url})\n`;
      if (attachment.bytes) {
        attachmentsFragments += template;
      } else {
        linksFragments += template;
      }
    }
  });
  return {
    images: imagesFragments,
    attachments: attachmentsFragments !== '' ? `Attachments\n\n${attachmentsFragments}\n` : '',
    links: linksFragments !== '' ? `Links\n\n${linksFragments}\n` : '',
  };
}

// MD Checklist Item
function mdChecklistItems(checklist) {
  var itemsFragments = '';
  _.forEach(checklist, item => {
    var fragment;
    if (item.state === 'incomplete') {
      fragment = `- ${item.name}\n`;
    } else {
      fragment = `- ~~${item.name}~~\n`;
    }
    itemsFragments += `${fragment}`;
  });
  return `${itemsFragments}\n`;
}

// MD Checklist
function mdChecklist(checklists) {
  var checklistsFragments = '';
  _.forEach(checklists, checklist => {
    checklistsFragments += `#### ${checklist.name}\n\n${mdChecklistItems(checklist.checkItems)}`;
  });
  return checklistsFragments;
}

// MD Cards
function mdCards(cards) {
  var cardsFragments = '';
  _.forEach(cards, card => {
    var cardText = card.desc !== '' ? `${card.desc}\n\n` : '';
    var cardChecklists = card.checklists.length > 0 ? mdChecklist(card.checklists) : '';
    var cardAttachments = card.attachments.length > 0 ? mdAttachments(card.attachments) : {images: '', attachments: '', links: ''};
    cardsFragments += `### [${card.name}](${card.url})\n\n${cardText}${cardAttachments.images}${cardChecklists}${cardAttachments.attachments}${cardAttachments.links}`;
  });
  return cardsFragments;
}

// Process MD
function processData(lists, meta) {
  md = `# ${meta.name}\n\n${mdLists(lists)}`;
}

// Pipe MD
function pipe() {
  return md;
}

exports.processData = processData;
exports.pipe = pipe;
