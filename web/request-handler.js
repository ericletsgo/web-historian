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
  
  // console.log(req);
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(archive.paths.indexHtml, 'utf8', (err, data) => {
      if (err) { throw err; }
      console.log(data);
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
      archive.addUrlToList(body.slice(4));
      res.writeHead(302, headers);
      res.end();
    });
  }

  // res.end(archive.paths.list);
};
