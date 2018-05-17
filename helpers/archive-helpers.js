var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  indexHtml: path.join(__dirname, '../web/public/index.html'),
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, (err, data) => {
    if (err) { throw err; }

    callback(data.toString('utf8').split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, (err, data) => {
    if (err) { throw err; }

    if (data.toString('utf8').split('\n').indexOf(url) !== -1) {
      callback(true);
    } else {
      callback(false);
    }
  }); 
};

exports.addUrlToList = function(url, callback) {
  // console.log('we in here', exports.paths.list)
  callback(fs.appendFile(exports.paths.list, url + '\n', (err) => {
    if (err) { throw err; } 
  }));
  
};

exports.isUrlArchived = function(url, callback) {
  fs.access(exports.paths.archivedSites + '/' + url, fs.constants.F_OK, (err) => {
    if (err) {
      callback(false);
    } 
    callback(true);
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    //npm request
  });
};
