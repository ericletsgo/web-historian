var path = require('path');
var archive = require('../helpers/archive-helpers');
var helper = require('./http-helpers');
var url = require('url');
var fs = require('fs');
// var parser = document.createElement('a');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  req.setEncoding('utf8');
  var headers = helper.headers;
  // parser.href = req.url;
  
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(archive.paths.indexHtml, 'utf8', (err, data) => {
      if (err) { throw err; }

      res.writeHead(200, headers);
      res.end(data);  
    });
  } else if (req.method === 'GET') {
    fs.access(archive.paths.archivedSites, fs.constants.F_OK, (err) => {
      if (err) { throw err; }
      fs.readFile(path.join(archive.paths.archivedSites, req.url), 'utf8', (err, data) => {
        if (err) {
          res.writeHead(404, headers);
          res.end();
        } 
        res.writeHead(200, headers);
        res.end(data);
      });
    }); 
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    }).on('end', function() {
      var url = body.slice(4);
      // check if url is archived
      archive.isUrlArchived(url, function(exist) {
        // if url is archived,
        if (exist) {
          // serve archived site
          fs.readFile(archive.paths.archivedSites + '/' + url, 'utf8', (err, data) => {
            if (err) { throw err; }
            res.writeHead(200, headers);
            res.end(data);
          });
        } else {
          // if url is not archived, check if it is in site.txt
          archive.isUrlInList(url, function(exist) {
            if (exist) {
              // if url is in list, serve loading page
              fs.readFile(archive.paths.loadingHtml, 'utf8', (err, data) => {
                if (err) { throw err; }
                res.writeHead(301, headers);
                res.end(data);
              });
            } else {
              // if url is not in list, add to list
              archive.addUrlToList(url, function(err) {
                // if add to list fails, serve 500
                if (err) {
                  fs.writeHead(500, headers);
                  fs.end();
                } else {
                  // if add to list success, serve loading page
                  fs.readFile(archive.paths.loadingHtml, 'utf8', (err, data) => {
                    if (err) { throw err; }
                    res.writeHead(301, headers);
                    res.end(data);
                  });
                }
              });
            }
          });
        }
      });
    });
  }

  // res.end(archive.paths.list);
};
