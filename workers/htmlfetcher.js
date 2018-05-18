// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var path = require('path');
var archive = require('../helpers/archive-helpers');
// var helper = require('./http-helpers');
var url = require('url');
var fs = require('fs');

fs.readFile(archive.paths.list, 'utf8', (err, data) => {
  if (err) { throw err; }
  let urls = data.toString().split('\n');
  urls.pop();
  archive.downloadUrls(urls);
});