var http = require('http');

var server = http.createServer(function (req, res) {
  console.log(req);
  res.close();
});

server.listen(process.env.PORT, '0.0.0.0');
