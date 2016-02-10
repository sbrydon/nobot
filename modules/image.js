'use strict';

const _ = require('lodash');
const config = require('../config');
const request = require('request');

let regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:image|img)\\s(?:of\\s)?(.+)`, 'i');

let makeRequest = (query, done) => {
  const params = {
    uri: 'https://www.googleapis.com/customsearch/v1',
    json: true,
    qs: {
      'q': query,
      'cx': config.google.cx,
      'searchType': 'image',
      'key': config.google.key
    }
  };

  request(params, (err, res, body) => {
    if (err) return done(err);

    if (body && body.items && body.items.length) {
      done(null, (_.sample(body.items)).link, true);
    } else {
      done(null, 'File not found', true);
    }
  });
};

let image = (text, done) => {
  let capture = regex.exec(text);

  if (!capture) return false;

  makeRequest(capture[1], done);
  return true;
}

module.exports = image;
