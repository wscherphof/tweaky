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
  columns: [],
  data: []
};

app.get('/clues', function (req, res, next) {
  res.json(clues);
});

app.post('/clues', function (req, res, next) {
  clues = req.body;
  res.json(clues);
});


app.listen(3000);
