var express = require('express');

var app = express.createServer();

app.configure(function () {
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
});


app.all('*', function (req, res, next) {
  console.log(req.method + ' ' + req.url);
  next();
});


app.get('/', function (req, res, next) {
  res.render('layout.jade');
});


var clues = {
  columns: ['naam', 'adres', 'woonplaats'],
  data: [{naam: 'Wouter', adres: 'Spoorbaanweg 17', woonplaats: 'Rhenen'}]
};

app.get('/clues', function (req, res, next) {
  res.json(clues.data);
});

app.delete('/clues', function (req, res, next) {
  clues = {
    columns: [],
    data: []
  };
  res.json(clues.data);
});

app.get('/clues/columns', function (req, res, next) {
  res.json(clues.columns);
});


app.listen(3000);
