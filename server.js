var http = require('http');
var util = require('util');
var express = require('express');

var app = express.createServer();

app.configure(function () {
  app.use(express.bodyParser());
});

var clues = [];
var clueFields = [];
app.get('/clues', function (req, res) {
  res.render('clues.jade', {layout: false});
});

app.post('/clues', function (req, res) {
  var lines = req.body.clues.split('\r\n');
  if (req.body.purge) clues = clueFields = [];
  if (req.body.fieldNames) {
    var firstLine = lines.shift();
    if (clueFields.length === 0) clueFields = firstLine.split(',');
  }
  lines.forEach(function (line) {
    if (line === '') return;
    var clue = {};
    var values = line.split(',');
    values.forEach(function (value, i) {
      var name = clueFields[i] || i;
      clue[name] = value;
    });
    clues.push(clue);
  });
  res.end(util.inspect(clues));
});


app.listen(3000);
