/*jslint node: true */

'use strict';

var Promise = require('bluebird');
var request = require('request');

const REGEXP_URL = new RegExp(/(?:^(?:https?:\/\/)?|^(?:w{3}\.)?|^(?:https?:\/\/w{3}\.)?)trello\.com\/b\/.+/);

// Get the JSON Data
function get(options) {
  var link = `${options.url}.json?fields=name,desc&lists=open&list_fields=name&cards=visible&card_checklists=all&card_attachments=true&members=owners&key=${options.key}&token=${options.token}`;
  return new Promise(function(resolve, reject) {
    if (!options.url) {
      reject('Empty URL');
    } else if (!options.url.match(REGEXP_URL)) {
      reject('Invalid Trello URL');
    } else {
      request(link, function(error, response) {
        if (!error && response.statusCode === 200) {
          var body;
          try {
            body = JSON.parse(response.body);
          } catch (error) {
            reject(`Access to the board was denied.`);
          } finally {
            resolve(body);
          }
        } else {
          reject(error);
        }
      });
    }
  });
}

exports.get = get;
